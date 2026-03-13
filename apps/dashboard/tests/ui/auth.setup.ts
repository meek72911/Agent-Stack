import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * Global Session Setup
 * It logs in once per run and saves the session to 'tests/auth/user.json'
 */
const authFile = path.join(__dirname, '../auth/user.json');

setup('authenticate', async ({ page }) => {
  // Ensure the auth directory exists
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Define credentials (recommend using environment variables)
  const email = process.env.TEST_USER_EMAIL || 'test@agentstack.dev';
  const password = process.env.TEST_USER_PASSWORD || 'testpassword123';

  console.log(`\n🔑 Authenticating for ${email}...`);

  // Simple login flow
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  
  // Fill in credentials
  const emailField = page.locator('input[type="email"]');
  const passwordField = page.locator('input[type="password"]');
  const loginButton = page.locator('button:has-text("Sign in")').first();

  if (await emailField.isVisible()) {
    await emailField.fill(email);
    await passwordField.fill(password);
    await loginButton.click();

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard/**', { timeout: 15000 });
    console.log('✅ Session saved to tests/auth/user.json');
    
    // Save authentication state
    await page.context().storageState({ path: authFile });
  } else {
    console.log('⚠️ Login form not found - assuming session already active or auth disabled.');
  }
});
