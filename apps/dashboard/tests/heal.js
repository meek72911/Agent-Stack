#!/usr/bin/env node
/**
 * AgentStack UNIVERSAL Self-Healer
 * 
 * Functions:
 * 1. Detects project language/framework automatically
 * 2. Parses universal test reports
 * 3. Generates fix prompts in the correct language (Python, Ruby, Node, PHP)
 */

const fs = require('fs');
const path = require('path');

const REPORT_PATH = 'tests/reports/universal-report.json';
const HEAL_PROMPT_PATH = 'tests/reports/HEAL-PROMPT.md';

function detectFramework() {
  const root = path.join(process.cwd(), '../..'); // Assuming call from apps/dashboard
  
  if (fs.existsSync(path.join(root, 'package.json'))) return { lang: 'JavaScript/TypeScript', framework: 'Node.js/Next.js/Nuxt' };
  if (fs.existsSync(path.join(root, 'requirements.txt')) || fs.existsSync(path.join(root, 'pyproject.toml'))) return { lang: 'Python', framework: 'Django/FastAPI/Flask' };
  if (fs.existsSync(path.join(root, 'composer.json'))) return { lang: 'PHP', framework: 'Laravel/Symfony' };
  if (fs.existsSync(path.join(root, 'Gemfile'))) return { lang: 'Ruby', framework: 'Rails' };
  
  return { lang: 'Unknown', framework: 'Generic Web' };
}

function main() {
  console.log('🔍 Running Universal Healer...');

  if (!fs.existsSync(REPORT_PATH)) {
    console.log('❌ No universal report found. Run tests first.');
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
  const frameworkInfo = detectFramework();
  
  console.log(`📡 Detected Project: ${frameworkInfo.lang} (${frameworkInfo.framework})`);

  if (report.stats.broken === 0 && report.stats.a11y === 0) {
    console.log('✅ UI is healthy. No healing needed.');
    return;
  }

  const prompt = `# 🔧 UNIVERSAL HEALER PROMPT
Generated: ${new Date().toISOString()}
Target Project: ${report.project}
Detected Stack: ${frameworkInfo.lang} | ${frameworkInfo.framework}

## 🚨 MISSION: Fix UI Baseline Failures
You are an expert engineer specialized in **${frameworkInfo.lang}**. 
Fix the following issues in the codebase.

### Instructions:
1. **Analyze**: Review the failures below.
2. **Context**: Use the detected framework (${frameworkInfo.framework}) patterns to find the relevant files.
3. **Fix**: 
   - **Functional/HTTP Errors**: Check the backend routes or frontend page logic.
   - **Accessibility**: Fix HTML semantics (aria-labels, contrast, alt tags).
   - **Consistency**: Update the test baseline ONLY if the UI design was intentional.

---

## 🛑 FAILURES
### Critical Breakages (${report.stats.broken})
${report.results.broken.map(b => `- ❌ ${b}`).join('\n')}

### A11y Violations (${report.stats.a11y})
${report.results.a11y.map(a => `- ♿ [${a.page}] ${a.title} (${a.impact})`).join('\n')}

### API Failures (${report.stats.api})
${report.results.api.map(f => `- 📡 [${f.page}] ${f.status} -> ${f.url}`).join('\n')}

---

## NEXT STEP:
Say: "I am ready to heal the **${frameworkInfo.lang}** codebase. Reading files now..."
`;

  fs.writeFileSync(HEAL_PROMPT_PATH, prompt);
  console.log(`\n📝 PROMPT GENERATED: ${HEAL_PROMPT_PATH}`);
  console.log(`Stack-specific instructions injected for ${frameworkInfo.lang}.`);
}

main();
