# AgentStack UI Testing Skill
**Version:** 1.0 | Zero API cost | Runs in IDE

---

## Overview

Automated UI testing with self-healing.
No paid API needed — uses your IDE's built-in AI.
Finds broken buttons, failed API calls, CORS errors.
Auto-generates fix prompts when tests fail.

---

## Setup (One Time — 3 commands)

```bash
# 1. Install Playwright
npm install -D @playwright/test

# 2. Install browser
npx playwright install chromium

# 3. Copy test files into your project
# playwright.config.ts → project root
# tests/ui/health-check.spec.ts → test file
# tests/heal.js → self-heal script
```

---

## Daily Usage

### Run all UI tests
```bash
npx playwright test
```

### Run and see visual report
```bash
npx playwright test --reporter=html
npx playwright show-report tests/reports
```

### When tests fail — self heal
```bash
node tests/heal.js
```
Opens HEAL-PROMPT.md → paste into IDE → AI fixes tests

### Run specific test only
```bash
npx playwright test --grep "API Health"
npx playwright test --grep "Landing"
```

### Run against production
```bash
PLAYWRIGHT_URL=https://agentstack.vercel.app npx playwright test
```

### Run against local
```bash
PLAYWRIGHT_URL=http://localhost:3000 npx playwright test
```

---

## What Gets Tested

```
✅ Every page loads (no 404/500)
✅ Every button is clickable
✅ Every API endpoint responds
✅ CORS — frontend can reach backend
✅ Login form works
✅ Console errors captured
✅ Screenshots on failure
✅ Full report generated
```

---

## Self-Heal Loop (Zero API Cost)

```
Test fails
    ↓
node tests/heal.js
    ↓
HEAL-PROMPT.md generated
    ↓
Paste into IDE: 
"Read tests/reports/HEAL-PROMPT.md 
 and fix all failing tests"
    ↓
IDE AI reads:
  - Failing test
  - Actual component code
  - Current page HTML
  ↓
IDE fixes the test
    ↓
npx playwright test → passes ✅
```

No Ollama. No API key. Your IDE does the healing.

---

## Add to package.json scripts

```json
{
  "scripts": {
    "test:ui": "playwright test",
    "test:ui:report": "playwright test --reporter=html && playwright show-report tests/reports",
    "test:ui:prod": "PLAYWRIGHT_URL=https://agentstack.vercel.app playwright test",
    "test:heal": "node tests/heal.js"
  }
}
```

---

## Pre-Deploy Usage

Before every Vercel/Render deploy:

```bash
# Test against local build
npm run build && npm run start &
PLAYWRIGHT_URL=http://localhost:3000 npm run test:ui

# If failures → heal
npm run test:heal
# Paste HEAL-PROMPT.md into IDE → fix → re-test

# All passing → deploy ✅
git push origin main
```

---

## File Structure

```
your-project/
├── playwright.config.ts       ← Playwright config
├── tests/
│   ├── ui/
│   │   └── health-check.spec.ts  ← Main test file
│   ├── heal.js                ← Self-heal script
│   ├── reports/               ← Auto-generated
│   │   ├── results.json
│   │   ├── UI-HEALTH-REPORT.md
│   │   └── HEAL-PROMPT.md     ← Paste into IDE
│   └── screenshots/           ← Auto-generated
└── ui-testing-skill.md        ← This file
```

---

## What Each Report Tells You

### UI-HEALTH-REPORT.md
```
Generated after every test run
Shows: broken buttons, API failures, CORS issues
Action: fix the issues listed
```

### HEAL-PROMPT.md
```
Generated when tests fail
Shows: exact test failures with context
Action: paste into IDE → AI fixes tests
```

### tests/screenshots/
```
Screenshot of every page after test
Shows: what the page looks like
Action: visual check that UI looks right
```

---

## Prompt to Set Up Everything

Paste this into your IDE once:

```
Read ui-testing-skill.md then set up 
Playwright UI testing for this project.

1. Add playwright.config.ts to project root
2. Create tests/ui/health-check.spec.ts
3. Create tests/heal.js
4. Update package.json with test scripts
5. Add tests/reports/ and tests/screenshots/ 
   to .gitignore

Use these pages for AgentStack:
/, /login, /register, /dashboard,
/dashboard/agents, /dashboard/workflows,
/dashboard/settings, /pricing

Use this API base:
https://agentstack-backend-kpxj.onrender.com

After setup tell me exact commands to run.
```

---

## Upgrade Path (Later)

```
Now:      Manual heal loop (free, IDE AI)
Month 2:  GitHub Actions (auto-run on push)
Month 3:  Playwright MCP (semantic selectors)
Month 4:  Full autonomous healing (no human needed)
```
