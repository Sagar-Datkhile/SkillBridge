"use client"

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react"
import {
  IconTrophy, IconFileCheck, IconCode, IconStack2, IconChartBar,
  IconTarget, IconCpu, IconBox, IconTerminal, IconRocket, IconScanEye,
  IconShare2, IconDownload, IconLink, IconCheck, IconSparkles,
  IconExternalLink, IconMap, IconFolderCode, IconBrandGithub,
  IconFlame, IconMedal, IconCalendar, IconClock, IconArrowUp,
  IconArrowDown, IconMinus, IconEye, IconEyeOff,IconPalette,
  IconUser, IconBriefcase, IconMapPin, IconEdit, IconDeviceFloppy,
  IconX, IconPlus, IconTrash, IconGripVertical, IconRefresh,
  IconPhoto, IconClipboard, IconPrinter,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"


// ─── Types ──────────────────────────────────────────────────────────────────────

interface Highlight {
  label: string
  color: "gold" | "green" | "blue" | "purple"
  icon: string
}

interface Subject {
  name: string
  score: number
  gradient: "default" | "warm" | "cool" | "fire"
  trend?: "up" | "down" | "same"
}

interface TestPerformance {
  totalTests: number
  averageScore: number
  highestScore: number
  streak: number
  lastTestDate: string
  subjects: Subject[]
  strongest: { name: string; score: number }
  weakest: { name: string; score: number }
}

interface Skill {
  name: string
  color: string
  proficiency?: number
}

interface ResumeInsights {
  atsScore: number
  extractedSkills: string[]
  keywords: string[]
  suggestions: string[]
}

interface TechStackItem {
  name: string
  items: string
}

interface Project {
  name: string
  description: string
  tags: string[]
  url?: string
  stars?: number
}

interface CodingPlatform {
  name: string
  color: string
  stats: Record<string, number | string>
}

interface ActivityDay {
  date: string
  count: number
}

interface ProfileData {
  user: {
    name: string
    title: string
    location: string
    bio: string
    avatarUrl: string
    initials: string
    profileUrl: string
    joinedDate: string
    socialLinks: { label: string; url: string }[]
  }
  highlights: Highlight[]
  testPerformance: TestPerformance
  skills: Skill[]
  resumeInsights: ResumeInsights
  techStack: TechStackItem[]
  projects: Project[]
  codingPlatforms: CodingPlatform[]
  activityHeatmap: ActivityDay[]
  certifications: { name: string; issuer: string; date: string }[]
  languages: { name: string; level: string }[]
}


// ─── Mock Data ──────────────────────────────────────────────────────────────────

function generateHeatmap(): ActivityDay[] {
  const days: ActivityDay[] = []
  const now = new Date()
  for (let i = 364; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    days.push({
      date: d.toISOString().slice(0, 10),
      count: Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 8) + 1,
    })
  }
  return days
}

const DEFAULT_PROFILE: ProfileData = {
  user: {
    name: "Pushkar Sharma",
    title: "Full-Stack Developer",
    location: "India",
    bio: "Passionate builder crafting scalable web apps. Open-source enthusiast with a love for clean architecture and developer tooling.",
    avatarUrl: "",
    initials: "PS",
    profileUrl: "aceledger.in/pushkar",
    joinedDate: "2024-08-15",
    socialLinks: [
      { label: "GitHub", url: "https://github.com/pushkar" },
      { label: "LinkedIn", url: "https://linkedin.com/in/pushkar" },
    ],
  },
  highlights: [
    { label: "Top 5% Scorer",  color: "gold",   icon: "trophy" },
    { label: "Resume Pro",     color: "green",  icon: "file-check" },
    { label: "50+ Problems",   color: "blue",   icon: "code" },
    { label: "Full-Stack",     color: "purple", icon: "layers" },
  ],
  testPerformance: {
    totalTests: 24,
    averageScore: 82,
    highestScore: 97,
    streak: 7,
    lastTestDate: "2026-03-28",
    subjects: [
      { name: "Data Structures", score: 91, gradient: "default", trend: "up" },
      { name: "System Design",   score: 78, gradient: "cool",    trend: "up" },
      { name: "Algorithms",      score: 85, gradient: "warm",    trend: "same" },
      { name: "Web Dev",         score: 88, gradient: "fire",    trend: "up" },
      { name: "DBMS",            score: 72, gradient: "default", trend: "down" },
    ],
    strongest: { name: "Data Structures", score: 91 },
    weakest:   { name: "DBMS",             score: 72 },
  },
  skills: [
    { name: "React",      color: "#61dafb", proficiency: 92 },
    { name: "TypeScript",  color: "#3178c6", proficiency: 88 },
    { name: "Next.js",     color: "#a0a0a0", proficiency: 85 },
    { name: "Node.js",     color: "#68a063", proficiency: 80 },
    { name: "Python",      color: "#ffd43b", proficiency: 78 },
    { name: "PostgreSQL",  color: "#336791", proficiency: 75 },
    { name: "Docker",      color: "#2496ed", proficiency: 70 },
    { name: "AWS",         color: "#ff9900", proficiency: 65 },
    { name: "GraphQL",     color: "#e535ab", proficiency: 72 },
    { name: "Redis",       color: "#dc382d", proficiency: 60 },
  ],
  resumeInsights: {
    atsScore: 87,
    extractedSkills: ["React", "Node.js", "TypeScript", "PostgreSQL", "REST APIs", "CI/CD", "Git", "Agile"],
    keywords: ["distributed systems", "microservices", "cloud native", "scalable", "performance", "full-stack", "API design", "team lead"],
    suggestions: [
      "Add quantifiable metrics to work experience",
      "Include a summary section at the top",
      "Add more action verbs to bullet points",
    ],
  },
  techStack: [
    { name: "Frontend",  items: "React, Next.js, TypeScript" },
    { name: "Backend",   items: "Node.js, Express, Python" },
    { name: "Database",  items: "PostgreSQL, Supabase, Redis" },
    { name: "DevOps",    items: "Docker, Vercel, GitHub Actions" },
  ],
  projects: [
    {
      name: "AceLedger",
      description: "AI-powered career platform with resume analysis, mock tests, and recruiter matching.",
      tags: ["Next.js", "Supabase", "AI"],
      url: "https://aceledger.in",
      stars: 128,
    },
    {
      name: "CodeFlow",
      description: "Real-time collaborative code editor with multi-language support and video chat.",
      tags: ["WebRTC", "React", "Node.js"],
      url: "https://github.com/pushkar/codeflow",
      stars: 64,
    },
    {
      name: "DevPulse",
      description: "Developer analytics dashboard tracking GitHub, LeetCode, and learning progress.",
      tags: ["Next.js", "D3.js", "API"],
      url: "https://github.com/pushkar/devpulse",
      stars: 42,
    },
  ],
  codingPlatforms: [
    { name: "LeetCode",    color: "#ffa116", stats: { solved: 187, contests: 12, rating: 1680 } },
    { name: "CodeForces",  color: "#1f8acb", stats: { solved: 94, contests: 8, rating: 1420 } },
    { name: "HackerRank",  color: "#00ea64", stats: { solved: 120, badges: 6, stars: 5 } },
    { name: "GitHub",      color: "#e0e0e0", stats: { repos: 32, contributions: 847, stars: 56 } },
  ],
  activityHeatmap: generateHeatmap(),
  certifications: [
    { name: "AWS Cloud Practitioner",    issuer: "Amazon",   date: "2025-06" },
    { name: "Meta Front-End Developer",  issuer: "Coursera", date: "2025-03" },
    { name: "Google Data Analytics",     issuer: "Google",   date: "2024-11" },
  ],
  languages: [
    { name: "English",  level: "Fluent" },
    { name: "Hindi",    level: "Native" },
  ],
}


// ─── Helpers ────────────────────────────────────────────────────────────────────

const HIGHLIGHT_ICONS: Record<string, React.FC<{ className?: string }>> = {
  trophy: IconTrophy,
  "file-check": IconFileCheck,
  code: IconCode,
  layers: IconStack2,
}

const GRADIENT_CLASSES: Record<string, string> = {
  default: "from-violet-500 via-purple-400 to-blue-400",
  warm:    "from-pink-500 to-amber-400",
  cool:    "from-teal-400 to-violet-500",
  fire:    "from-orange-500 to-yellow-400",
}

const BADGE_COLORS: Record<string, string> = {
  gold:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  green:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  blue:   "bg-blue-500/10 text-blue-400 border-blue-500/20",
  purple: "bg-violet-500/10 text-violet-400 border-violet-500/20",
}

function TrendIcon({ trend }: { trend?: string }) {
  if (trend === "up")   return <IconArrowUp className="size-3 text-emerald-400" />
  if (trend === "down") return <IconArrowDown className="size-3 text-red-400" />
  return <IconMinus className="size-3 text-zinc-500" />
}

function daysSince(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}


// ─── Activity Heatmap ───────────────────────────────────────────────────────────

function ActivityHeatmap({ data }: { data: ActivityDay[] }) {
  const weeks = useMemo(() => {
    const w: ActivityDay[][] = []
    for (let i = 0; i < data.length; i += 7) {
      w.push(data.slice(i, i + 7))
    }
    return w
  }, [data])

  const getColor = (count: number) => {
    if (count === 0) return "bg-zinc-800/60"
    if (count <= 2)  return "bg-violet-900/60"
    if (count <= 4)  return "bg-violet-700/70"
    if (count <= 6)  return "bg-violet-500/80"
    return "bg-violet-400"
  }

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex gap-[3px] min-w-max">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => (
              <TooltipProvider key={di} delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn("size-[11px] rounded-[2px] transition-colors", getColor(day.count))} />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {day.count} contributions on {day.date}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-zinc-500">
        <span>Less</span>
        {[0, 2, 4, 6, 8].map(v => (
          <div key={v} className={cn("size-[10px] rounded-[2px]", getColor(v))} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}


// ─── Circular Progress Ring ─────────────────────────────────────────────────────

function ScoreRing({ value, size = 72, stroke = 5, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const [offset, setOffset] = useState(c)

  useEffect(() => {
    const t = setTimeout(() => setOffset(c - (c * value) / 100), 200)
    return () => clearTimeout(t)
  }, [value, c])

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(230 15% 15%)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="url(#portfolioRingGrad)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-extrabold font-mono text-white">{value}</span>
        {label && <span className="text-[9px] text-zinc-500 font-medium">{label}</span>}
      </div>
    </div>
  )
}


// ─── Section Wrapper ────────────────────────────────────────────────────────────

function Section({ icon: Icon, title, children, collapsible = false }: {
  icon: React.FC<{ className?: string }>
  title: string
  children: React.ReactNode
  collapsible?: boolean
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:border-zinc-700">
      <button
        onClick={collapsible ? () => setOpen(o => !o) : undefined}
        className={cn(
          "flex items-center gap-2 w-full text-left mb-3",
          collapsible && "cursor-pointer"
        )}
      >
        <Icon className="size-4 text-violet-400 shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex-1">{title}</span>
        {collapsible && (open ? <IconEye className="size-3.5 text-zinc-600" /> : <IconEyeOff className="size-3.5 text-zinc-600" />)}
      </button>
      {open && children}
    </div>
  )
}


// ─── Portfolio Client ───────────────────────────────────────────────────────────

export function PortfolioClient() {
  const [data, setData] = useState<ProfileData>(DEFAULT_PROFILE)
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState<"dark" | "midnight" | "aurora">("dark")
  const cardRef = useRef<HTMLDivElement>(null)

  // animated progress bars
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 400); return () => clearTimeout(t) }, [])

  const totalSolved = useMemo(() =>
    data.codingPlatforms.reduce((a, p) => a + (typeof p.stats.solved === "number" ? p.stats.solved : 0), 0),
    [data.codingPlatforms]
  )

  const themeClasses: Record<string, string> = {
    dark:     "bg-[#0b0d14]",
    midnight: "bg-[#080a12]",
    aurora:   "bg-[#0a0e18]",
  }

  const headerGradients: Record<string, string> = {
    dark:     "from-violet-600 via-purple-500 to-blue-500",
    midnight: "from-indigo-700 via-violet-600 to-fuchsia-600",
    aurora:   "from-emerald-600 via-teal-500 to-cyan-500",
  }

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const handleDownload = useCallback(async () => {
    try {
      // dynamic import html2canvas
      const html2canvas = (await import("html2canvas")).default
      const el = cardRef.current
      if (!el) return
      const canvas = await html2canvas(el, {
        backgroundColor: "#0b0d14",
        scale: 2, useCORS: true, logging: false,
      })
      const link = document.createElement("a")
      link.download = `${data.user.name.replace(/\s+/g, "_")}_portfolio.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch {
      alert("Screenshot failed. Try using your browser's screenshot tool.")
    }
  }, [data.user.name])

  const handlePrint = useCallback(() => window.print(), [])

  return (
    <div className="min-h-screen w-full">
      {/* Page header */}
      <div className="px-4 pt-8 pb-0 md:px-8">
        <div className="space-y-0.5">
          <h1 className="text-xl font-semibold tracking-tight">Portfolio</h1>
          <p className="text-sm text-muted-foreground">
            Your shareable career profile card — edit, preview, and share it anywhere.
          </p>
        </div>
      </div>

      <div className="px-4 py-6 md:px-8 md:py-8">
        {/* ── Toolbar ─────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Select value={theme} onValueChange={(v: "dark" | "midnight" | "aurora") => setTheme(v)}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <IconPalette className="size-3.5 mr-1.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="midnight">Midnight</SelectItem>
              <SelectItem value="aurora">Aurora</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={handleCopyLink}>
                  {copied ? <IconCheck className="size-3.5" /> : <IconLink className="size-3.5" />}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy a shareable link</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={handlePrint}>
            <IconPrinter className="size-3.5" />
            Print
          </Button>

          <Button size="sm" className="h-8 gap-1.5 text-xs bg-violet-600 hover:bg-violet-700 text-white" onClick={handleDownload}>
            <IconDownload className="size-3.5" />
            Download PNG
          </Button>
        </div>

        {/* ── SVG Defs ──────────────────────────────────────────────────── */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="portfolioRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
        </svg>

        {/* ── Card ────────────────────────────────────────────────────── */}
        <div className="flex justify-center print:justify-start">
          <div
            ref={cardRef}
            className={cn(
              "w-full max-w-[560px] rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl shadow-violet-500/5 transition-colors duration-500",
              themeClasses[theme]
            )}
          >
            {/* Header Gradient */}
            <div className={cn("relative px-8 pt-8 pb-20 bg-gradient-to-br", headerGradients[theme])}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_40%)]" />
              <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#0b0d14]" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-white/90 uppercase">
                  <div className="size-6 rounded-md bg-white/15 flex items-center justify-center backdrop-blur-sm">
                    <IconMap className="size-3.5" />
                  </div>
                  AceLedger
                </div>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-white/15 border border-white/20 backdrop-blur-sm hover:bg-white/25 transition"
                >
                  <IconShare2 className="size-3.5" />
                  Share
                </button>
              </div>
            </div>

            {/* Avatar Row */}
            <div className="flex items-end gap-4 px-8 -mt-12 relative z-20">
              <div className="size-[88px] rounded-full border-4 border-[#0b0d14] bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center text-[32px] font-extrabold text-white shrink-0 shadow-xl relative">
                {data.user.avatarUrl
                  ? <img src={data.user.avatarUrl} alt="" className="size-full rounded-full object-cover" />
                  : data.user.initials
                }
                <span className="absolute bottom-0.5 right-0.5 size-5 rounded-full bg-emerald-500 border-[3px] border-[#0b0d14] flex items-center justify-center">
                  <IconCheck className="size-2.5 text-white" />
                </span>
              </div>
              <div className="pb-2 min-w-0">
                <h2 className="text-xl font-extrabold text-white truncate leading-tight">{data.user.name}</h2>
                <p className="text-sm text-zinc-400 flex items-center gap-1.5 mt-0.5">
                  {data.user.title}
                  <span className="size-1 rounded-full bg-zinc-600" />
                  {data.user.location}
                </p>
              </div>
            </div>

            {/* Bio */}
            {data.user.bio && (
              <p className="px-8 mt-3 text-xs text-zinc-500 leading-relaxed line-clamp-2">
                {data.user.bio}
              </p>
            )}

            {/* Body */}
            <div className="px-8 pt-5 pb-8 flex flex-col gap-5">

              {/* Highlights */}
              <div className="flex flex-wrap gap-2">
                {data.highlights.map((h, i) => {
                  const HIcon = HIGHLIGHT_ICONS[h.icon] ?? IconSparkles
                  return (
                    <span
                      key={i}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border",
                        BADGE_COLORS[h.color]
                      )}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <HIcon className="size-3.5" />
                      {h.label}
                    </span>
                  )
                })}
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Tests", value: data.testPerformance.totalTests, icon: IconChartBar },
                  { label: "Avg Score", value: `${data.testPerformance.averageScore}%`, icon: IconTarget },
                  { label: "Streak", value: `${data.testPerformance.streak}d`, icon: IconFlame },
                  { label: "Problems", value: totalSolved, icon: IconCode },
                ].map((m, i) => (
                  <div key={i} className="text-center p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition group">
                    <m.icon className="size-4 text-zinc-600 mx-auto mb-1.5 group-hover:text-violet-400 transition-colors" />
                    <div className="text-lg font-extrabold bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {m.value}
                    </div>
                    <div className="text-[10px] text-zinc-600 font-medium mt-1">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Subject Scores */}
              <Section icon={IconTarget} title="Subject Scores" collapsible>
                <div className="space-y-2.5">
                  {data.testPerformance.subjects.map((s, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                          {s.name}
                          <TrendIcon trend={s.trend} />
                        </span>
                        <span className="text-xs font-bold font-mono text-violet-400">{s.score}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out", GRADIENT_CLASSES[s.gradient])}
                          style={{ width: animated ? `${s.score}%` : "0%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Strongest / Weakest */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-center">
                  <div className="text-lg">🏆</div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mt-1">Strongest</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">{data.testPerformance.strongest.name}</div>
                  <div className="text-xs font-mono text-zinc-500">{data.testPerformance.strongest.score}%</div>
                </div>
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3.5 text-center">
                  <div className="text-lg">📈</div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mt-1">Needs Work</div>
                  <div className="text-sm font-bold text-red-400 mt-0.5">{data.testPerformance.weakest.name}</div>
                  <div className="text-xs font-mono text-zinc-500">{data.testPerformance.weakest.score}%</div>
                </div>
              </div>

              {/* Activity Heatmap */}
              <Section icon={IconCalendar} title="Activity (Last 52 Weeks)" collapsible>
                <ActivityHeatmap data={data.activityHeatmap} />
              </Section>

              {/* Skills with Proficiency */}
              <Section icon={IconCpu} title="Skillset">
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((s, i) => (
                    <TooltipProvider key={i} delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 hover:border-violet-500/40 hover:bg-violet-500/5 transition cursor-default">
                            <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                            {s.name}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          Proficiency: {s.proficiency ?? "—"}%
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </Section>

              {/* Tech Stack */}
              <Section icon={IconBox} title="Tech Stack">
                <div className="space-y-2.5">
                  {data.techStack.map((t, i) => (
                    <div key={i}>
                      <div className="text-xs font-semibold text-zinc-300">{t.name}</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">{t.items}</div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Coding Platforms */}
              <Section icon={IconTerminal} title="Coding Platforms">
                <div className="grid grid-cols-2 gap-2.5">
                  {data.codingPlatforms.map((p, i) => (
                    <div key={i} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 transition">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="size-5 rounded flex items-center justify-center text-[9px] font-extrabold text-white"
                          style={{ backgroundColor: p.color }}
                        >
                          {p.name[0]}
                        </span>
                        <span className="text-xs font-bold text-zinc-300">{p.name}</span>
                      </div>
                      <div className="space-y-1">
                        {Object.entries(p.stats).map(([k, v]) => (
                          <div key={k} className="flex justify-between text-[11px]">
                            <span className="text-zinc-600 capitalize">{k}</span>
                            <span className="font-mono font-semibold text-zinc-400">{typeof v === "number" ? v.toLocaleString() : v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Projects */}
              <Section icon={IconRocket} title="Featured Projects">
                <div className="space-y-2.5">
                  {data.projects.map((p, i) => (
                    <div key={i} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 transition">
                      <div className="flex items-center gap-2">
                        <IconFolderCode className="size-4 text-violet-400 shrink-0" />
                        <span className="text-sm font-bold text-white flex-1 truncate">{p.name}</span>
                        {p.stars != null && (
                          <span className="text-[10px] font-mono text-amber-400 flex items-center gap-0.5">
                            ★ {p.stars}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">{p.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.tags.map(t => (
                          <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/15">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Certifications */}
              <Section icon={IconMedal} title="Certifications" collapsible>
                <div className="space-y-2">
                  {data.certifications.map((c, i) => (
                    <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-800/40 border border-zinc-800">
                      <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <IconMedal className="size-4 text-amber-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-zinc-300 truncate">{c.name}</div>
                        <div className="text-[10px] text-zinc-500">{c.issuer} · {c.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Resume & ATS Insights */}
              <Section icon={IconScanEye} title="Resume & ATS Insights">
                <div className="flex items-center gap-4 mb-4">
                  <ScoreRing value={data.resumeInsights.atsScore} label="ATS" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-zinc-200">ATS Compatibility Score</div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Your resume is well-optimized for applicant tracking systems.
                    </p>
                  </div>
                </div>

                {/* Verified Skills */}
                <div className="mb-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-2">Verified Skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.resumeInsights.extractedSkills.map(s => (
                      <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
                        <IconCheck className="size-3 text-emerald-400" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                <div className="mb-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-2">Extracted Keywords</div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.resumeInsights.keywords.map(k => (
                      <span key={k} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-zinc-800/60 border border-zinc-800 text-zinc-400 hover:text-violet-400 hover:border-violet-500/30 transition cursor-default">
                        #{k}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-2">Improvement Suggestions</div>
                  <ul className="space-y-1.5">
                    {data.resumeInsights.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-zinc-500 leading-relaxed">
                        <IconSparkles className="size-3 text-amber-400 shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>

              {/* Languages */}
              {data.languages.length > 0 && (
                <div className="flex items-center gap-4 px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Languages:</span>
                  <div className="flex flex-wrap gap-2">
                    {data.languages.map((l, i) => (
                      <span key={i} className="text-[11px] font-medium text-zinc-400">
                        {l.name} <span className="text-zinc-600">({l.level})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                <IconSparkles className="size-3.5 text-violet-400" />
                Generated by AceLedger
              </div>
              <a href="#" onClick={e => e.preventDefault()} className="text-[11px] font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition">
                {data.user.profileUrl}
                <IconExternalLink className="size-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
