// ─── GitHub Public API Utilities ──────────────────────────────────────────────
// Unauthenticated — 60 requests/hour per IP. Sufficient for personal use.

export interface GitHubRepo {
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  topics: string[]
  fork: boolean
  updated_at: string
}

export interface GitHubProfile {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  public_repos: number
  followers: number
  following: number
  html_url: string
  location: string | null
}

export interface GitHubEvent {
  type: string
  created_at: string
  repo: { name: string }
}

export interface GitHubActivityDay {
  date: string
  count: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extract the GitHub username from a URL like:
 *   https://github.com/pushkar
 *   https://github.com/pushkar/
 *   github.com/pushkar
 */
export function extractGitHubUsername(url: string): string | null {
  if (!url) return null
  const cleaned = url.replace(/\/+$/, "").trim()
  const match = cleaned.match(/(?:github\.com\/)([a-zA-Z0-9_-]+)$/i)
  return match ? match[1] : null
}

// ─── API Calls ────────────────────────────────────────────────────────────────

const GH_API = "https://api.github.com"

async function ghFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${GH_API}${path}`, {
      headers: { Accept: "application/vnd.github+json" },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function fetchGitHubProfile(
  username: string
): Promise<GitHubProfile | null> {
  return ghFetch<GitHubProfile>(`/users/${username}`)
}

export async function fetchGitHubRepos(
  username: string,
  limit = 6
): Promise<GitHubRepo[]> {
  const repos = await ghFetch<GitHubRepo[]>(
    `/users/${username}/repos?sort=stars&direction=desc&per_page=${limit}&type=owner`
  )
  return (repos ?? []).filter((r) => !r.fork)
}

export async function fetchGitHubEvents(
  username: string
): Promise<GitHubEvent[]> {
  // GitHub returns up to 10 pages of 30 events, but we'll grab 3 pages max
  const allEvents: GitHubEvent[] = []
  for (let page = 1; page <= 3; page++) {
    const events = await ghFetch<GitHubEvent[]>(
      `/users/${username}/events/public?per_page=100&page=${page}`
    )
    if (!events || events.length === 0) break
    allEvents.push(...events)
  }
  return allEvents
}

/**
 * Build a 365-day activity heatmap from GitHub public events.
 * Each push event counts as one "contribution" for that day.
 */
export function buildActivityHeatmap(events: GitHubEvent[]): GitHubActivityDay[] {
  const now = new Date()
  const dayMap = new Map<string, number>()

  // Initialize all 365 days with 0
  for (let i = 364; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    dayMap.set(d.toISOString().slice(0, 10), 0)
  }

  // Tally push events
  for (const event of events) {
    if (event.type === "PushEvent") {
      const day = event.created_at.slice(0, 10)
      if (dayMap.has(day)) {
        dayMap.set(day, (dayMap.get(day) ?? 0) + 1)
      }
    }
  }

  return Array.from(dayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }))
}

/**
 * Aggregate language usage from repos (most used language by repo count).
 */
export function aggregateLanguages(repos: GitHubRepo[]): { name: string; count: number }[] {
  const langMap = new Map<string, number>()
  for (const repo of repos) {
    if (repo.language) {
      langMap.set(repo.language, (langMap.get(repo.language) ?? 0) + 1)
    }
  }
  return Array.from(langMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}
