"use server"

import { createClient } from "@/lib/supabase/server"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PortfolioDBData {
  user: {
    id: string
    displayName: string
    email: string
    avatarPath: string | null
    username: string | null
    accountType: string
  }
  candidate: {
    firstName: string | null
    lastName: string | null
    fullName: string | null
    courseName: string | null
    passoutYear: number | null
    skills: string[] | null
    githubUrl: string | null
    linkedinUrl: string | null
    portfolioLinks: string[] | null
    currentAddress: string | null
    cgpa: number | null
    profileImagePath: string | null
  } | null
  testPerformance: {
    totalTests: number
    averageScore: number
    highestScore: number
    streak: number
    lastTestDate: string | null
    subjects: {
      name: string
      accuracy: number
      totalQuestions: number
      correctCount: number
    }[]
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Calculate the current "streak" — consecutive days with at least one submitted
 * test attempt, counting backwards from today.
 */
function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0

  const uniqueDays = [...new Set(dates.map((d) => d.slice(0, 10)))].sort().reverse()
  const today = new Date().toISOString().slice(0, 10)

  // The streak must include today or yesterday to be active
  if (uniqueDays[0] !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    if (uniqueDays[0] !== yesterday) return 0
  }

  let streak = 1
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1])
    const curr = new Date(uniqueDays[i])
    const diff = (prev.getTime() - curr.getTime()) / 86400000
    if (diff === 1) {
      streak++
    } else {
      break
    }
  }
  return streak
}

// ─── Main action ──────────────────────────────────────────────────────────────

export async function getPortfolioData(): Promise<PortfolioDBData> {
  const supabase = await createClient()

  // 1. Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const userId = user.id

  // 2. Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, email, avatar_path, username, account_type")
    .eq("id", userId)
    .single()

  // 3. Fetch candidate profile
  const { data: candidate } = await supabase
    .from("candidate_profiles")
    .select(
      "first_name, last_name, full_name, course_name, passout_year, skills, github_url, linkedin_url, portfolio_links, current_address, cgpa, profile_image_path"
    )
    .eq("profile_id", userId)
    .single()

  // 4. Fetch test attempts (submitted only)
  const { data: attempts } = await supabase
    .from("test_attempts")
    .select("id, score, total_marks, percentage, submitted_at, status")
    .eq("student_id", userId)
    .in("status", ["submitted", "auto_submitted"])
    .order("submitted_at", { ascending: false })

  const attemptList = attempts ?? []

  // Compute test performance stats
  const totalTests = attemptList.length
  const scores = attemptList
    .map((a) => (a.percentage != null ? Number(a.percentage) : null))
    .filter((s): s is number => s !== null)

  const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const highestScore = scores.length > 0 ? Math.round(Math.max(...scores)) : 0

  const submittedDates = attemptList
    .map((a) => a.submitted_at)
    .filter((d): d is string => d !== null)

  const streak = computeStreak(submittedDates)
  const lastTestDate = submittedDates.length > 0 ? submittedDates[0] : null

  // 5. Fetch per-tag (subject) performance using the tag_performance view
  const { data: tagPerf } = await supabase
    .from("tag_performance")
    .select("tag_name, total_questions, correct_count, accuracy_pct")
    .eq("student_id", userId)

  // Aggregate across all tests: group by tag_name, sum questions and correct
  const tagMap = new Map<string, { total: number; correct: number }>()
  for (const row of tagPerf ?? []) {
    const tagName = row.tag_name as string | null
    if (!tagName) continue
    const existing = tagMap.get(tagName) ?? { total: 0, correct: 0 }
    existing.total += Number(row.total_questions ?? 0)
    existing.correct += Number(row.correct_count ?? 0)
    tagMap.set(tagName, existing)
  }

  const subjects = Array.from(tagMap.entries())
    .map(([name, { total, correct }]) => ({
      name,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      totalQuestions: total,
      correctCount: correct,
    }))
    .sort((a, b) => b.accuracy - a.accuracy)

  return {
    user: {
      id: userId,
      displayName: profile?.display_name ?? user.email ?? "User",
      email: profile?.email ?? user.email ?? "",
      avatarPath: profile?.avatar_path ?? null,
      username: profile?.username ?? null,
      accountType: profile?.account_type ?? "candidate",
    },
    candidate: candidate
      ? {
          firstName: candidate.first_name,
          lastName: candidate.last_name,
          fullName: candidate.full_name,
          courseName: candidate.course_name,
          passoutYear: candidate.passout_year,
          skills: candidate.skills,
          githubUrl: candidate.github_url,
          linkedinUrl: candidate.linkedin_url,
          portfolioLinks: candidate.portfolio_links,
          currentAddress: candidate.current_address,
          cgpa: candidate.cgpa != null ? Number(candidate.cgpa) : null,
          profileImagePath: candidate.profile_image_path,
        }
      : null,
    testPerformance: {
      totalTests,
      averageScore,
      highestScore,
      streak,
      lastTestDate,
      subjects,
    },
  }
}
