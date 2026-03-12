---
name: Universal Code Review Skill
description: A codebase-aware code review skill for any repo or stack.
---

# Universal Code Review Skill
**Version:** 1.0 | **Author:** Sarthak Khedkar | **Date:** March 2026

---

## Overview

A universal, codebase-aware code review skill that works for ANY repo, ANY stack.
Drop this file into any project. The AI reads your codebase first, learns your
patterns, then reviews code the way a senior engineer would — not generic rules,
YOUR rules.

Inspired by how Greptile, Qodo, and CodeRabbit work — but as a portable skill
file that works in any IDE (Cursor, Windsurf, VS Code, OpenCode, Claude Code).

---

## How It Works — 3 Phases

```
PHASE 1 — DISCOVER (run once per project)
  Reads your entire repo structure
  Detects your stack, patterns, conventions
  Saves a CODEBASE-CONTEXT.md snapshot

PHASE 2 — REVIEW (run on any file or PR)
  Uses context snapshot + review checklist
  Reviews against YOUR patterns not generic rules
  Outputs structured report with severity levels

PHASE 3 — PRE-DEPLOY (run before every deploy)
  Checks deployment readiness
  Catches the issues that break production
  Saves you from 50 failed Vercel deployments
```

---

## PHASE 1 — CODEBASE DISCOVERY AGENT

### Agent: `Codebase Discoverer`
```
Role:    Senior Staff Engineer doing codebase onboarding
Input:   Root directory of the project
Output:  CODEBASE-CONTEXT.md — complete project snapshot

Steps:
1. Read root directory structure (2 levels deep)
2. Read package.json / requirements.txt / Gemfile / go.mod / pom.xml
3. Detect stack:
   - Frontend: Next.js / React / Vue / Svelte / plain HTML
   - Backend: FastAPI / Express / Django / Rails / Laravel / Go / Rust
   - Database: PostgreSQL / MySQL / MongoDB / Supabase / PlanetScale
   - Auth: Supabase / NextAuth / Clerk / Auth0 / custom JWT
   - Hosting: Vercel / Render / Railway / AWS / Heroku / Fly.io
   - Queue: BullMQ / Celery / Sidekiq / SQS
   - Storage: S3 / R2 / GCS / local
4. Map folder patterns:
   - Where are routes/controllers?
   - Where are components?
   - Where are types/interfaces?
   - Where are utilities/helpers?
   - Where are tests?
5. Detect naming conventions:
   - File naming (PascalCase? kebab-case? snake_case?)
   - Function naming patterns
   - Variable naming patterns
   - API endpoint naming (REST? GraphQL? tRPC?)
6. Read any existing config files:
   - .eslintrc / .eslintrc.json
   - .prettierrc
   - pyproject.toml / setup.cfg
   - tsconfig.json
   - tailwind.config.js
7. Check for existing patterns in 3-5 sample files per category
8. Save all findings to CODEBASE-CONTEXT.md

Prompt:
  Scan this codebase and produce a CODEBASE-CONTEXT.md file.
  Include: (1) detected tech stack with versions,
  (2) folder structure map with purpose of each folder,
  (3) naming conventions observed (files, functions, variables, routes),
  (4) coding patterns used (error handling style, async patterns,
      component structure, API response format),
  (5) dependencies and their versions,
  (6) any existing lint/format rules,
  (7) what this project does in 2 sentences.
  Be specific. No generic assumptions.
```

---

## PHASE 2 — CODE REVIEW AGENT

### How to trigger
```
In your IDE, say:
"Review [filename or folder] using the code review skill"
OR
"Review the changes I just made"
OR
"Review this PR diff: [paste diff]"
```

### Agent: `Senior Code Reviewer`
```
Role:    Senior Staff Engineer with 10+ years experience
         Specializes in: security, performance, maintainability
Input:   File(s) to review + CODEBASE-CONTEXT.md
Output:  Structured review report — severity grouped, actionable fixes

Review Checklist (in order of importance):
```

---

### REVIEW CATEGORY 1 — Security (P0)

```
Check for:
□ Hardcoded secrets, API keys, passwords, tokens
□ SQL injection — raw queries with user input
□ NoSQL injection — unvalidated MongoDB/Redis queries
□ Command injection — user input in exec/shell commands
□ Path traversal — user-controlled file paths
□ IDOR — can user A access user B's data?
□ Missing authentication on protected routes
□ Missing authorization (authed but wrong role)
□ JWT not validated / wrong algorithm / no expiry
□ Sensitive data in logs or error messages
□ CORS configured too loosely (wildcard *)
□ Missing rate limiting on auth endpoints
□ Insecure direct object references
□ XSS — unsanitized user input in HTML/JSX
□ CSRF — state-changing GET requests
□ Insecure file upload (no type/size validation)
□ Dependencies with known CVEs
□ Encryption keys stored insecurely
□ Passwords stored without hashing (bcrypt/argon2)
□ Sensitive data in URL params or query strings

Severity: Any finding here = CRITICAL or HIGH
```

---

### REVIEW CATEGORY 2 — Bugs & Correctness (P1)

```
Check for:
□ Unhandled promise rejections / async errors
□ Missing null/undefined checks (causes runtime crashes)
□ Off-by-one errors in loops or array access
□ Race conditions in concurrent operations
□ Infinite loops / missing base cases in recursion
□ Wrong HTTP status codes in API responses
□ Missing error handling in try/catch blocks
□ Silent failures (catching errors and doing nothing)
□ Type mismatches (especially TypeScript `any` abuse)
□ Incorrect boolean logic (off by negation)
□ Missing required fields in database operations
□ Incorrect date/time handling (timezone issues)
□ Floating point precision errors in money/finance
□ Missing transaction wrapping for multi-step DB ops
□ State mutation bugs in React components
□ Stale closure bugs in event handlers/callbacks
□ Memory leaks (event listeners not cleaned up)
□ SSE/WebSocket connections not closed on disconnect
□ Queue jobs not retried on failure

Severity: CRITICAL if data loss possible, HIGH otherwise
```

---

### REVIEW CATEGORY 3 — Performance (P2)

```
Check for:
□ N+1 query problems (loop with DB call inside)
□ Missing database indexes on WHERE/JOIN columns
□ Fetching more data than needed (SELECT * everywhere)
□ Missing pagination on list endpoints
□ Synchronous operations that should be async
□ Blocking the event loop with CPU-heavy work
□ Missing caching for expensive repeated operations
□ Large payload sizes (sending entire objects when ID suffices)
□ Re-rendering entire lists when one item changes
□ Missing React.memo / useMemo / useCallback where needed
□ Images not optimized (missing next/image, lazy loading)
□ Missing database connection pooling
□ Waterfall API calls that could be parallelized
□ Missing indexes on foreign keys
□ Loading entire file into memory instead of streaming

Severity: HIGH if affects response time >500ms, MEDIUM otherwise
```

---

### REVIEW CATEGORY 4 — Code Quality & Maintainability (P3)

```
Check for:
□ Functions longer than 50 lines (should be split)
□ Files longer than 300 lines (should be split)
□ Deeply nested code (more than 3 levels = refactor)
□ Magic numbers/strings (hardcoded values without constants)
□ Duplicate code (same logic in 2+ places)
□ Dead code (unreachable or unused variables/functions)
□ Inconsistent naming with rest of codebase
□ Missing or wrong TypeScript types
□ Console.log left in production code
□ TODO comments without ticket/issue reference
□ Commented-out code blocks
□ Functions doing more than one thing
□ Tight coupling (module depends on internal details of another)
□ Missing input validation on public functions
□ Inconsistent error response format vs rest of API
□ Missing JSDoc/docstrings on public functions
□ Test coverage missing for critical paths

Severity: MEDIUM or LOW
```

---

### REVIEW CATEGORY 5 — Consistency Check (P3)

```
Compare against CODEBASE-CONTEXT.md and check:
□ Does naming match project conventions?
□ Does folder placement match project structure?
□ Does error handling style match rest of codebase?
□ Does API response format match other endpoints?
□ Does component structure match other components?
□ Are the same utility functions used (not reinvented)?
□ Does this break any existing patterns?
□ Are imports organized consistently?

Severity: LOW (but flag all — consistency matters)
```

---

### REVIEW CATEGORY 6 — Deployment Readiness (P1)

```
Check for:
□ Any localhost / 127.0.0.1 hardcoded URLs
□ Any hardcoded port numbers (3000, 8000, 8002 etc.)
□ Environment variables used but not in .env.example
□ .env files committed to git
□ DEBUG=True or development mode flags in production code
□ Missing health check endpoint
□ CORS not configured for production domains
□ Database URL pointing to local instead of cloud
□ Missing production error handling (showing stack traces)
□ console.log / print statements logging sensitive data
□ Missing graceful shutdown handling
□ Dependencies not pinned (using * or latest)

Severity: CRITICAL — these break production
```

---

### Output Format

```
## Code Review Report
**File(s):** [filename]
**Reviewer:** Senior Code Reviewer Agent
**Date:** [date]
**Stack Context:** [from CODEBASE-CONTEXT.md]

---

### 🔴 CRITICAL (Fix before any deploy)
[Issue #1]
- Location: file.py line 42
- Problem: [clear description]
- Risk: [what can go wrong]
- Fix:
  ```language
  [exact replacement code]
  ```

### 🟠 HIGH (Fix before launch)
[same format]

### 🟡 MEDIUM (Fix this sprint)
[same format]

### 🟢 LOW (Nice to have)
[same format]

---

### Summary
- 🔴 Critical: X issues
- 🟠 High: X issues
- 🟡 Medium: X issues
- 🟢 Low: X issues
- Overall Code Quality Score: X/10

### Top 3 things to fix right now:
1. [most important]
2. [second most important]
3. [third most important]
```

---

## PHASE 3 — PRE-DEPLOY CHECKLIST AGENT

### Agent: `Deployment Guard`
```
Role:    Senior DevOps Engineer
Input:   Entire codebase + .env + deployment config
Output:  GO / NO-GO decision with blocking issues list

Run this before EVERY deploy. Catches the issues
that cause failed Vercel/Render deployments.
```

### Pre-Deploy Checklist

```
ENVIRONMENT
□ All required env vars present in .env
□ No localhost URLs in production env vars
□ APP_URL and API_URL set to real domains
□ DATABASE_URL points to cloud DB not localhost
□ Redis URL is cloud instance (rediss://)
□ .env is in .gitignore
□ .env.example is up to date

FRONTEND (Next.js)
□ All NEXT_PUBLIC_ vars set
□ No hardcoded API URLs (using NEXT_PUBLIC_API_URL)
□ No localhost:3000 or localhost:8000 references
□ next.config.js has correct domains for images
□ Build succeeds locally (npm run build)
□ No TypeScript errors (npm run typecheck)
□ No ESLint errors (npm run lint)

BACKEND (FastAPI / Express / etc)
□ Start command is correct for production
□ Port uses $PORT env variable not hardcoded
□ CORS origins include production frontend domain
□ Health check endpoint exists and returns 200
□ All routers imported and registered
□ requirements.txt / package.json up to date
□ No debug mode / hot reload in production start command

DATABASE
□ Migrations run on production DB
□ Seed data applied if needed
□ Connection pooling configured
□ SSL enabled on DB connection

DEPENDENCIES
□ No missing packages (imports match installed packages)
□ No conflicting package versions
□ Lock file (package-lock.json / pnpm-lock.yaml) committed

SECURITY
□ No secrets in code or git history
□ JWT secret is strong (32+ chars)
□ Encryption key is production value not placeholder
□ Rate limiting enabled on auth endpoints

OUTPUT FORMAT:
🚀 DEPLOY: GO
or
🛑 DEPLOY: NO-GO
Blocking issues:
1. [issue] — [file] — [fix]
2. [issue] — [file] — [fix]
```

---

## Stack-Specific Review Rules

### FastAPI (Python)
```
□ All routes have proper response_model defined
□ All routes use Depends() for auth not inline checks
□ Async routes use await properly (no blocking calls)
□ Pydantic models validate all inputs
□ HTTPException used for errors not generic Exception
□ Background tasks don't block request/response
□ Database sessions properly closed after use
□ No raw SQL — use ORM or parameterized queries
```

### Next.js (TypeScript)
```
□ Server components vs client components used correctly
□ No sensitive data in client components
□ API routes validate request body with zod/yup
□ Images use next/image not raw <img>
□ Fonts use next/font not @import
□ Error boundaries on async server components
□ Loading states for all data fetching
□ No useEffect for data that can be server-side
```

### Supabase
```
□ RLS enabled on all tables
□ Service role key only used server-side never client
□ Anon key only used for public data
□ Policies cover: select, insert, update, delete
□ No direct SQL bypassing RLS on user data
□ Auth checks use auth.uid() in policies
□ Realtime only enabled on tables that need it
```

### React / Frontend
```
□ No API keys or secrets in frontend code
□ Forms validate before submitting
□ Error states shown to user not just console
□ Loading states prevent double-submit
□ Lists have keys that are stable (not index)
□ useEffect cleanup functions for subscriptions
□ No direct DOM manipulation (use refs)
```

---

## How to Use in Your IDE

### Setup (one time)
```
1. Drop code-review.md in your repo root
2. Run Phase 1 once:
   "Read code-review.md then scan this entire codebase
    and generate CODEBASE-CONTEXT.md"
3. Done — context is saved
```

### Daily usage
```
Review a file:
"Using code-review.md and CODEBASE-CONTEXT.md,
 review apps/api/routers/workflows.py"

Review recent changes:
"Using code-review.md, review the changes
 I just made to the auth module"

Pre-deploy check:
"Run the pre-deploy checklist from code-review.md
 on this entire codebase"

Security audit only:
"Run only the security checks from code-review.md
 on the entire backend"
```
