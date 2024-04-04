// @ts-check
const { defineConfig, devices } = require('@playwright/test');
import dotenv from 'dotenv';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

dotenv.config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_SITE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Chrome Stable',
      use: {
        browserName: 'chromium',
        // channel: 'chrome',
        fullyParallel: true,
      },
    },
    {
      name: 'Safari MacBook Air',
      use: {
        browserName: 'webkit',
        viewport: {
          width: 2560,
          height: 1620,
        },
      },
    },
    {
      name: 'Firefox Desktop',
      use: {
        browserName: 'firefox',
        viewport: {
          width: 1920,
          height: 1080,
        },
      },
    },
    {
      name: 'iPhone 6/7/8',
      use: devices['iPhone 8'],
    },
    {
      name: 'iPhone 6/7/8 Plus',
      use: devices['iPhone 8 Plus'],
    },
    {
      name: 'iPhone 12',
      use: devices['iPhone 12'],
    },
    {
      name: 'iPhone 12 Pro',
      use: devices['iPhone 12 Pro'],
    },
    {
      name: 'iPhone 12 Pro Max',
      use: devices['iPhone 12 Pro Max'],
    },
    {
      name: 'iPhone 5/SE',
      use: devices['iPhone SE'],
    },
    {
      name: 'iPad',
      use: devices['iPad (gen 7)'],
    },
    {
      name: 'iPad landscape',
      use: devices['iPad (gen 7) landscape'],
    },
    {
      name: 'iPad Mini',
      use: devices['iPad Mini'],
    },
    {
      name: 'iPad Mini landscape',
      use: devices['iPad Mini landscape'],
    },
    {
      name: 'iPad Pro 11',
      use: devices['iPad Pro 11'],
    },
    {
      name: 'iPad Pro 11 landscape',
      use: devices['iPad Pro 11 landscape'],
    },
  ]
  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
