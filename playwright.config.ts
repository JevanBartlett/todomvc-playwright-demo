import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,           // Run tests in parallel (faster)
//   forbidOnly: !!process.env.CI,  // Fail if test.only() left in CI
//   retries: process.env.CI ? 2 : 0, // Retry failed tests in CI
//   workers: process.env.CI ? 1 : undefined, // Single worker in CI
  reporter: 'html',               // HTML report for debugging
  
  use: {
    baseURL: 'http://localhost:3000', // Change to your target URL
    trace: 'on-first-retry',          // Capture trace on failure
    screenshot: 'only-on-failure',    // Screenshot when tests fail
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Add more browsers when you actually need them
  ],
});