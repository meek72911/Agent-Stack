#!/usr/bin/env node
/**
 * AgentStack Self-Heal Script
 * 
 * Reads failed Playwright test results
 * Generates a fix prompt for your IDE AI
 * No API key needed — uses your IDE's Claude
 * 
 * Run: node tests/heal.js
 */

const fs = require('fs');
const path = require('path');

const REPORT_PATH = 'tests/reports/results.json';
const HEAL_PROMPT_PATH = 'tests/reports/HEAL-PROMPT.md';

// ── Read test results ─────────────────────────────────────────
function readResults() {
  if (!fs.existsSync(REPORT_PATH)) {
    console.log('❌ No test results found. Run: npx playwright test first');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
}

// ── Extract failures ──────────────────────────────────────────
function extractFailures(results) {
  const failures = [];

  if (!results.suites) return failures;

  function walkSuites(suites) {
    for (const suite of suites) {
      if (suite.specs) {
        for (const spec of suite.specs) {
          for (const test of spec.tests || []) {
            for (const result of test.results || []) {
              if (result.status === 'failed') {
                failures.push({
                  title: spec.title,
                  file: spec.file,
                  error: result.error?.message || 'Unknown error',
                  snippet: result.error?.snippet || '',
                  duration: result.duration,
                });
              }
            }
          }
        }
      }
      if (suite.suites) {
        walkSuites(suite.suites);
      }
    }
  }

  walkSuites(results.suites);
  return failures;
}

// ── Generate heal prompt for IDE ──────────────────────────────
function generateHealPrompt(failures) {
  if (failures.length === 0) {
    return `# ✅ All Tests Passing!\nNo healing needed. Great job.`;
  }

  const prompt = `# 🔧 AgentStack Self-Heal Prompt
Generated: ${new Date().toISOString()}
Failed Tests: ${failures.length}

## Instructions for IDE AI
Read this file and fix all failing Playwright tests.
For each failure:
1. Read the test file at the given path
2. Read the actual component/page it's testing
3. Understand WHY it failed (UI change? Missing element? API change?)
4. Fix the test to match current UI — don't just suppress the error
5. If it's a real bug (not a test issue) — mark it as TODO with explanation

---

## Failing Tests

${failures.map((f, i) => `
### Failure ${i + 1}: ${f.title}
**File:** ${f.file}
**Error:** ${f.error}
${f.snippet ? `**Code:**\n\`\`\`\n${f.snippet}\n\`\`\`` : ''}

**Possible causes:**
- Element selector changed (button text renamed?)
- Element no longer exists (feature removed?)
- API endpoint changed (check apps/api/app/routers/)
- Page route changed (check apps/dashboard/app/)
- Auth required (need to login first?)

**Fix approach:**
1. Check the actual current HTML of the page
2. Find the correct selector or element
3. Update the test in ${f.file}
`).join('\n---\n')}

---

## After Fixing
Run: \`npx playwright test\`
All tests should pass.
If a test still fails — it's a real bug, not a test issue.
`;

  return prompt;
}

// ── DOM Snapshot helper ───────────────────────────────────────
function generateSnapshotPrompt() {
  return `
---

## How to Capture DOM for Healing
If you need to see current page HTML, add this to the failing test:

\`\`\`typescript
// Add temporarily to debug
const html = await page.content();
fs.writeFileSync('tests/reports/dom-snapshot.html', html);
\`\`\`

Then read dom-snapshot.html to find correct selectors.
`;
}

// ── Main ──────────────────────────────────────────────────────
function main() {
  console.log('🔍 Reading test results...\n');

  const results = readResults();
  const failures = extractFailures(results);

  console.log(`Found ${failures.length} failing tests\n`);

  if (failures.length === 0) {
    console.log('✅ All tests passing! Nothing to heal.');
    return;
  }

  // Generate heal prompt
  const prompt = generateHealPrompt(failures) + generateSnapshotPrompt();
  fs.writeFileSync(HEAL_PROMPT_PATH, prompt);

  console.log(`📝 Heal prompt saved to: ${HEAL_PROMPT_PATH}`);
  console.log('\n─────────────────────────────────────');
  console.log('NEXT STEP:');
  console.log('1. Open your IDE');
  console.log('2. Say: "Read tests/reports/HEAL-PROMPT.md and fix all failing tests"');
  console.log('3. Run: npx playwright test');
  console.log('4. Repeat until all pass ✅');
  console.log('─────────────────────────────────────\n');

  // Print summary
  console.log('Failing tests:');
  failures.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.title}`);
    console.log(`     Error: ${f.error.split('\n')[0]}`);
  });
}

main();
