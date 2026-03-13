---
name: AgentStack UNIVERSAL UI Testing Skill
description: Framework-agnostic UI Testing with Auto-Discovery, Multi-stack Healing, and JSON Config.
---

# AgentStack UNIVERSAL UI Testing Skill (Level 5)

This skill provides a framework-agnostic system for automated UI health, accessibility, and visual checks across any web project (Next.js, Django, Laravel, Rails, etc.).

## 🌍 Universal Features:
1.  **Auto-Discovery**: Crawls `sitemap.xml` to find pages automatically. No more hardcoded URL lists.
2.  **Redirection Integrity Audit**: Automatically verifies that URLs (like `/register` or `/dashboard`) correctly point to their new destinations.
3.  **External Config**: Driven by `agentstack-test.config.json` for easy environment switching.
4.  **Language-Agnostic Healing**: The `heal.js` script detects your project language (Python, Ruby, PHP, Node) and writes the fix prompt in that language's context.
5.  **Baseline Snapshots**: Visual regression for any UI, regardless of framework.

## 🛠️ Setup & Configuration:

### 1. The Config File (`agentstack-test.config.json`)
```json
{
  "project": "YourProjectName",
  "baseURL": "http://localhost:3000",
  "discovery": { "mode": "auto", "sitemapPath": "/sitemap.xml" },
  "testing": { "a11y": true, "visual": true }
}
```

## 🚀 Usage:

### 🔬 Run the Universal Scan
```bash
cd apps/dashboard
npx playwright test
```

### 🩹 Self-Healing (Multi-Stack)
If tests fail:
1.  Run: `node tests/heal.js`
2.  The script will detect your stack (e.g., Python/Django) and generate `HEAL-PROMPT.md`.
3.  Ask your AI: "Read HEAL-PROMPT.md and fix the issues in the [Detected Language] codebase."

## 📜 How it Works:
- **Navigation**: Uses the sitemap to build a dynamic test queue.
- **Auditing**: Uses Axe-core for A11y and Playwright for Visual/HTTP checks.
- **Reporting**: Generates `universal-report.json` which acts as the 'truth' for the healer.
