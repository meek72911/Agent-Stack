import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { AxeBuilder } from '@axe-core/playwright';
import { XMLParser } from 'fast-xml-parser';

/**
 * AgentStack UNIVERSAL UI Health Check - LEVEL 5
 * Decoupled from framework - Driven by agentstack-test.config.json
 */

const configPath = path.join(process.cwd(), 'agentstack-test.config.json');
const testConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const BROKEN: string[] = [];
const API_FAILURESSize: { page: string; url: string; status: number }[] = [];
const A11Y_FAILURES: { page: string; title: string; impact: string }[] = [];

// 2. Page Discovery Logic
let discoveredPages: { name: string; path: string; authRequired?: boolean }[] = [];

test.beforeAll(async ({ request }) => {
  const baseURL = testConfig.baseURL || 'http://localhost:3000';

  if (testConfig.discovery.mode === 'auto') {
    console.log(`\n🔍 UNIVERSAL: Discovering pages via ${testConfig.discovery.sitemapPath}...`);
    try {
      const response = await request.get(`${baseURL}${testConfig.discovery.sitemapPath}`);
      if (response.ok()) {
        const xmlData = await response.text();
        const parser = new XMLParser();
        const jsonObj = parser.parse(xmlData);
        
        // Handle various sitemap formats (urlset vs sitemapindex)
        const urls = jsonObj.urlset?.url || [];
        const locs = Array.isArray(urls) ? urls.map((u: any) => u.loc) : [urls.loc].filter(Boolean);

        if (locs.length > 0) {
          discoveredPages = locs
            .slice(0, testConfig.testing.maxDiscoveryPages || 20)
            .map((url: string) => {
              const pathStr = new URL(url).pathname;
              return {
                name: pathStr === '/' ? 'Home' : pathStr.replace(/^\//, '').split('/')[0].toUpperCase(),
                path: pathStr,
                authRequired: pathStr.includes('dashboard') || pathStr.includes('admin')
              };
            });
          console.log(`✅ Discovered ${discoveredPages.length} pages.`);
        }
      }
    } catch (e) {
      console.log(`⚠️ Discovery failed: Using config fallbacks.`);
    }
  }

  if (discoveredPages.length === 0) {
    discoveredPages = testConfig.discovery.fallbackPages.map((p: string) => ({
      name: p === '/' ? 'Home' : p.replace(/^\//, '').toUpperCase(),
      path: p,
      authRequired: p.includes('dashboard') || p.includes('admin')
    }));
  }
});

// ── TEST: Universal Scan ─────────────────────────────────────
test.describe('Universal Framework Scanner', () => {

  test('Execute Deep Scan', async ({ page }) => {
    for (const p of discoveredPages) {
      console.log(`\n🩺 Scanning ${testConfig.framework || ''}: ${p.name} (${p.path})`);
      
      // A. Setup tracking
      page.on('response', async (res) => {
        const url = res.url();
        const status = res.status();
        if ((url.includes('/api/') || status >= 500) && status < 600) {
           if (status >= 400 && status !== 401 && status !== 403) {
             API_FAILURESSize.push({ page: p.name, url, status });
           }
        }
      });

      // B. Network Simulation
      if (testConfig.testing.networkEmulation) {
        const cdp = await page.context().newCDPSession(page);
        await cdp.send('Network.emulateNetworkConditions', {
          offline: false,
          latency: testConfig.testing.networkEmulation === 'Slow 3G' ? 400 : 100,
          downloadThroughput: (testConfig.testing.networkEmulation === 'Slow 3G' ? 400 : 1600) * 1024 / 8,
          uploadThroughput: 400 * 1024 / 8,
        });
      }

      // C. Navigation
      const response = await page.goto(p.path, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null);
      if (!response) {
        BROKEN.push(`[${p.name}] Load Timeout`);
        continue;
      }

      // D. HTTP check
      if (response.status() >= 400 && !(p.authRequired && [401, 403].includes(response.status()))) {
        BROKEN.push(`[${p.name}] HTTP ${response.status()}`);
      }

      // E. A11y Audit
      if (testConfig.testing.a11y) {
        try {
          const results = await new AxeBuilder({ page }).analyze();
          results.violations.forEach(v => A11Y_FAILURES.push({ page: p.name, title: v.help, impact: v.impact || 'minor' }));
        } catch (e) {}
      }

      // F. Visual Snapshot
      if (testConfig.testing.visual) {
         await expect(page).toHaveScreenshot(`${p.name.toLowerCase()}.png`, { fullPage: true }).catch(() => null);
      }
    }

    // G. Generate Universal Artifacts
    const reportsDir = 'tests/reports';
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

    const report = {
      project: testConfig.project,
      timestamp: new Date().toISOString(),
      stats: { broken: BROKEN.length, a11y: A11Y_FAILURES.length, api: API_FAILURESSize.length },
      results: { broken: BROKEN, a11y: A11Y_FAILURES, api: API_FAILURESSize }
    };
    
    fs.writeFileSync(path.join(reportsDir, 'universal-report.json'), JSON.stringify(report, null, 2));

    const md = `# 🌍 UNIVERSAL HEALTH REPORT
- **Project**: ${testConfig.project}
- **Scan Status**: ${report.stats.broken === 0 ? '✅ HEALTHY' : '🛑 ISSUES FOUND'}

## Summary
- ❌ **Broken Pages**: ${report.stats.broken}
- ♿ **A11y Violations**: ${report.stats.a11y}
- 📡 **API Errors**: ${report.stats.api}

## Details
${BROKEN.map(b => `- ${b}`).join('\n')}
${A11Y_FAILURES.slice(0, 5).map(a => `- ♿ [${a.page}] ${a.title}`).join('\n')}

**🔗 Next step: node tests/heal.js**
`;
    fs.writeFileSync(path.join(reportsDir, 'HEALTH-REPORT.md'), md);
  });
});
