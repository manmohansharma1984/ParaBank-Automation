import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './environment.config';

export default defineConfig({
  timeout: envConfig.defaultTimeout,
  expect: { timeout: 10000 },

  // Run tests in parallel for faster feedback in development,
  // but scale down in CI to avoid overwhelming shared test environments.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? envConfig.retryAttempts : 0,
  workers: process.env.CI ? 1 : 2,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }], 
  ],


  use: {
    baseURL: envConfig.baseUrl,
    trace: envConfig.traceOnRetry ? 'on-first-retry' : 'retain-on-failure',
    screenshot: envConfig.screenshotOnFailure ? 'only-on-failure' : 'off',
  },

  projects: [
    {
      name: 'ui',
      testDir: './tests/ui/e2e',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: 'test-results',
})