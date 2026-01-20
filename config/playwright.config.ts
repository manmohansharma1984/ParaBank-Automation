import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './environment.config';

export default defineConfig({
  testDir: './tests',
  timeout: envConfig.defaultTimeout,
  expect: { timeout: 10000 },

  // Design decision: Enable parallel execution for faster feedback in development,
  // but scale down in CI to avoid overwhelming shared test environments.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? envConfig.retryAttempts : 0,
  workers: process.env.CI ? 1 : 2,

  reporter: [['html'], ['list']],

  use: {
    baseURL: envConfig.baseUrl,
    trace: envConfig.traceOnRetry ? 'on-first-retry' : 'retain-on-failure',
    screenshot: envConfig.screenshotOnFailure ? 'only-on-failure' : 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
