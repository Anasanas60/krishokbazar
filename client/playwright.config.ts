import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './playwright',
  timeout: 30_000,
  expect: {
    timeout: 5000
  },
  reporter: 'list',
  use: {
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
