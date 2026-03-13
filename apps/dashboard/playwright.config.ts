import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * AgentStack Advanced Playwright Config
 */
const STORAGE_STATE = path.join(__dirname, 'tests/auth/user.json');

export default defineConfig({
  testDir: './tests/ui',
  timeout: 45000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'tests/reports/html', open: 'never' }],
    ['json', { outputFile: 'tests/reports/results.json' }],
    ['list']
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    // 1. Setup project (DOES NOT use storageState)
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    // 2. Main Desktop Project (Uses persistent session)
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },

    // 3. Mobile Viewport
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },

    // 4. Tablet Viewport
    {
      name: 'tablet-safari',
      use: { 
        ...devices['iPad Mini'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
  ],

  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 200,
      threshold: 0.2,
    },
  },
});
