import 'dotenv/config';

/**
 * Environment configuration for ParaBank test automation.
 *
 * Design decision: Centralized environment configuration to support
 * multiple test environments (dev, staging, prod) and easy switching.
 * Uses dotenv for .env file support.
 */

export const envConfig = {
  // Application URLs
  baseUrl: process.env.BASE_URL || 'https://parabank.parasoft.com',
  apiBaseUrl: process.env.API_BASE_URL || 'https://parabank.parasoft.com/parabank/services/bank',

  // Environment settings
  environment: process.env.ENV || 'development',

  // Test settings
  defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
  navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || '60000'),
  retryAttempts: parseInt(process.env.RETRY_ATTEMPTS || '0'),

  // Feature flags
  screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE === 'true',
  traceOnRetry: process.env.TRACE_ON_RETRY === 'true',
};
