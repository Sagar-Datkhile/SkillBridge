<div align="center">

<img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />
<img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase" />
<img src="https://img.shields.io/badge/AI-OpenRouter-FF6B35?style=for-the-badge&logo=openai" />
<img src="https://img.shields.io/badge/Blockchain-SHA256%20Verified-F7931A?style=for-the-badge&logo=bitcoin" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" />

<br /><br />

# 🎓 AcadLedger

### *The Bridge Between Academia and Industry — Rebuilt from the Ground Up*

**A centralized, blockchain-verified portal for intelligent opportunity discovery, skill-gap analysis, and end-to-end academic project lifecycle management.**

[🚀 Live Demo](#) · [📹 Video Walkthrough](#) · [📄 Docs](#architecture)

---

</div>

## 📌 Problem Statement

> *The bridge between academia and industry is currently fragmented. Internship opportunities are scattered across siloed job boards, and academic projects often lack real-world relevance because students cannot easily find industry mentors or datasets. There is a significant skills gap mismatch, and recruiters struggle to verify the authentic contribution of students in group-based academic work.*

**AcadLedger** is our answer to this challenge — a unified, AI-powered, blockchain-verified platform that closes the academia-industry gap at every stage of a student's career journey.

---

## 🎯 Objective

Create a **centralized, blockchain-verified portal** for:
- 🔍 Intelligent, skill-based opportunity discovery
- 📊 Automated skill-gap analysis with AI
- 🗂️ End-to-end project and application lifecycle management
- 🤝 Transparent, verifiable student-recruiter collaboration

---

## ✅ Expected Outcomes (How We Deliver Them)

| Expected Outcome | AcadLedger Implementation |
|---|---|
| Skill-based, hyper-personalized opportunity matching using NLP-driven resume-to-JD parsing | **AI Resume Analyzer** — GPT-4 class LLM parses resumes against JDs, produces ATS scores, keyword gap analysis, and section-by-section feedback |
| Simplified, transparent application tracking and milestone management | **Recruiter ATS Kanban Board** — drag-and-drop pipeline with status: `pending → reviewing → shortlisted → hired/rejected` |
| Strengthened industry-academia collaboration through co-sponsored projects | **Recruiter Postings Portal** — recruiters publish skill-tagged opportunities; students apply directly within the platform |
| Higher student placement rates and verifiable digital project portfolios | **Blockchain-Verified Profiles** — SHA-256 hashed academic portfolios with Git-scraper integration for authentic contribution tracking |

---

## 🌟 Key Features

### 🤖 AI-Powered Resume Analyzer
- Upload resume PDF → select a Job Description → get instant AI analysis
- Returns: **ATS Score (0–100)**, matched/missing keywords, **skill gap breakdown** (technical, tools, soft), section-level feedback, improved bullet points, and a shortlist verdict
- **Multi-model fallback chain** (Gemini 2.5 Flash → Llama 4 → Gemini 2.0 → DeepSeek → Llama 3.3 → Qwen3) via OpenRouter — zero downtime even under rate limits
- PDF text extraction with `pdf-parse`; truncation safety for large resumes

### 🕷️ Git Scraper — Authentic Contribution Tracking
- Scrapes public GitHub repositories linked to academic projects
- Extracts commit history, file-level contributions, and PR/issue activity
- Maps contributions **per-student** in group projects — solving the "free rider" problem
- Results are hashed and stored as verifiable blockchain records

### 🔗 Blockchain-Verified Portfolios (SHA-256)
- Every academic milestone, test score, project contribution, and certification is hashed using **SHA-256**
- Hash is stored on-chain, making credentials **tamper-evident and independently verifiable**
- Recruiters can one-click verify any student's portfolio authenticity
- Eliminates resume fraud and ghostwritten project submissions

### 📋 Recruiter ATS Kanban Board
- Full drag-and-drop Kanban (`pending → applied → reviewing → shortlisted → rejected → hired`) built with `@dnd-kit`
- Optimistic UI updates with server-side sync
- Applicant detail drawer with resume, cover letter, and profile
- Bulk status management, search, and filter

### 📢 Opportunity Posting & Discovery
- Recruiters create structured postings: skills required, stipend, duration, location/remote, deadline, max applications
- **Optional skill gate**: attach a proctored test that candidates must pass before applying
- Students browse and filter opportunities matched to their verified skill profile

### 🧪 Proctored Skill Assessment Engine
- Recruiters build dynamic MCQ tests (single correct, multiple correct, true/false)
- Features: shuffle questions/options, strict mode (tab-switch detection), configurable time limits, negative marking
- Server-side auto-grading via PostgreSQL stored procedures (`grade_attempt_v2`)
- Session resume — if a student loses connection, they pick up exactly where they left off

### 📈 Analytics Dashboards
- **Recruiter dashboard**: live/upcoming/past tests, total attempts, draft stats, placement rates
- **Candidate dashboard**: completed tests, available opportunities, ATS score history, skill progress

### 👤 Dual-Role Architecture
- `candidate` — Students with academic profiles, skill tests, resume uploads, applications
- `recruiter` — Companies/institutions with test creation, postings, ATS pipeline, analytics

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
│   Next.js 15 (App Router) + React 19 + Tailwind CSS v4     │
│   ├── /auth         — Sign in / Sign up                    │
│   ├── /~/home       — Role-aware dashboard                 │
│   ├── /~/jobs       — Opportunity discovery (students)     │
│   ├── /~/postings   — ATS management (recruiters)         │
│   ├── /~/tests      — Proctored assessment engine          │
│   ├── /~/resume     — Resume builder                       │
│   ├── /~/resume-analyzer — AI resume ↔ JD parser          │
│   ├── /~/analytics  — Placement analytics                  │
│   └── /~/candidates — Talent pool (recruiters)             │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                       Backend                               │
│   Supabase (PostgreSQL 15 + Auth + Storage + RLS)          │
│   ├── Row-Level Security on every table                    │
│   ├── Stored Procedures (grade_attempt, save_test_v2…)     │
│   ├── Triggers (auto-profile creation, session sync)       │
│   └── Edge Functions for webhook integrations              │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                        │
│   ├── OpenRouter AI  — Multi-LLM resume analysis           │
│   ├── Git Scraper API — GitHub contribution extraction     │
│   └── SHA-256 Hasher — Blockchain credential verification  │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema Highlights

| Table | Purpose |
|---|---|
| `profiles` | Unified user identity (candidate / recruiter) |
| `candidate_profiles` | Academic details, skills, institution linkage |
| `recruiter_profiles` | Company info, branding |
| `opportunities` | Job/internship postings with skill requirements |
| `applications` | Application lifecycle with status tracking |
| `tests` | Proctored assessments linked to opportunities |
| `questions` / `options` | MCQ bank with tagging |
| `test_attempts` | Secure attempt tracking with expiry & resume |
| `attempt_answers` | Per-question answer records for grading |
| `blockchain_records` | SHA-256 hashed credential store |
| `git_contributions` | Per-student GitHub activity from scraper |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Actions) |
| **Language** | TypeScript 5 |
| **UI** | Tailwind CSS v4, Radix UI, shadcn/ui |
| **Animations** | Motion (Framer Motion v12), dnd-kit |
| **Database** | Supabase (PostgreSQL 15) |
| **Auth** | Supabase Auth (JWT + OAuth) |
| **AI/LLM** | OpenRouter (Gemini, Llama, DeepSeek, Qwen) |
| **PDF Processing** | pdf-parse (server-side) |
| **Blockchain** | SHA-256 (Node.js crypto) |
| **Git Scraper** | Python Flask API + PyGitHub |
| **Export** | jsPDF + jspdf-autotable |
| **Deployment** | Vercel (Frontend) + Supabase Cloud |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A Supabase project
- An OpenRouter API key (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/pushkar2510/AcadLedger.git
cd AcadLedger

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# AI (OpenRouter)
OPENROUTER_API_KEY=your_openrouter_key

# Git Scraper Backend
NEXT_PUBLIC_GIT_SCRAPER_URL=http://localhost:5000
```

### Database Setup

```bash
# Apply the full schema to your Supabase project
# Go to Supabase Studio > SQL Editor and run:
schema_recruiter.sql   # Full production schema
```

### Run Locally

```bash
npm run dev
# App runs at http://localhost:3000
```

### Running the Git Scraper

```bash
cd git-scraper
pip install -r requirements.txt
python app.py
# Scraper API runs at http://localhost:5000
```

---

## 🔐 Security & Trust Architecture

### Row-Level Security (RLS)
Every database table is protected by PostgreSQL RLS policies — users can only access their own data. Recruiters cannot see other recruiters' candidates; candidates cannot see other candidates' applications.

### Proctoring
- Tab-switch detection with server-recorded `tab_switch_count`
- Strict mode locks the browser viewport
- Server-side expiry: if a student's timer runs out, the attempt is auto-submitted and graded server-side via a stored procedure — no client-side manipulation possible

### Blockchain Verification (SHA-256)
```
Student completes milestone
        ↓
Platform serializes: { student_id, milestone_type, result, timestamp }
        ↓
SHA-256 hash generated on server
        ↓
Hash stored in `blockchain_records` table
        ↓
Recruiter verifies: recomputes hash from public data → compare → ✅ or ❌
```

This makes every score, certificate, and project contribution **independently verifiable** without trusting AcadLedger's servers.

---

## 📂 Project Structure

```
AcadLedger/
├── app/
│   ├── (dashboard)/~/
│   │   ├── home/            # Role-aware landing dashboard
│   │   ├── jobs/            # Opportunity discovery (students)
│   │   ├── postings/        # Recruiter posting management + ATS Kanban
│   │   ├── tests/           # Test creation & attempts
│   │   ├── resume/          # Resume builder
│   │   ├── resume-analyzer/ # AI resume ↔ JD analyzer
│   │   ├── analytics/       # Placement analytics
│   │   ├── candidates/      # Recruiter talent pool
│   │   └── settings/        # Profile & preferences
│   ├── auth/                # Sign in / Sign up
│   └── page.tsx             # Marketing landing page
├── components/
│   ├── app-sidebar.tsx      # Navigation sidebar
│   ├── feature-section.tsx  # Landing page features
│   └── ui/                  # Design system components
├── lib/
│   └── supabase/            # Server & client helpers
├── schema_recruiter.sql     # Full production database schema
└── schema.sql               # Original schema dump
```

---

## 🤝 Team

> Built at **[Hackathon Name]** — *[Date]*

| Name | Role |
|---|---|
| [Team Lead] | Full-Stack & AI Integration |
| [Member 2] | Blockchain & Git Scraper |
| [Member 3] | UI/UX & Frontend |
| [Member 4] | Database & Backend |

---

## 📊 Impact Metrics (Target)

- 🎓 **Students** — Reduce time-to-first-internship by 40% via personalized matching
- 🏢 **Recruiters** — Cut screening time by 60% with AI-ranked, skill-verified candidates
- 🔒 **Trust** — 100% verifiable credentials via SHA-256 blockchain hashing
- 🌐 **Opportunities** — Real-time aggregation from GitHub activity + job postings

---

## 📜 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ to close the gap between students and their dreams.**

*AcadLedger — Where academic achievement meets industry opportunity.*

</div>
