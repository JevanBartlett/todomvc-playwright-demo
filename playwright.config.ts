import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv'

dotenv.config();

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: false,           // Run tests in parallel (faster)
//   forbidOnly: !!process.env.CI,  // Fail if test.only() left in CI
//   retries: process.env.CI ? 2 : 0, // Retry failed tests in CI
//   workers: process.env.CI ? 1 : undefined, // Single worker in CI
  reporter: 'html',               // HTML report for debugging
  
  use: {
    headless: false,
    launchOptions: {slowMo: 500},
    baseURL: 'https://demo.playwright.dev/todomvc/#/', // Change to your target URL
    trace: 'on-first-retry',          // Capture trace on failure
    screenshot: 'only-on-failure',    // Screenshot when tests fail
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Add more browsers when you actually need them
  ],
});