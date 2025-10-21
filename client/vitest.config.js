import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    globals: true,
    exclude: ['playwright/**', 'playwright.config.ts', 'playwright/**.ts', 'node_modules/**']
  },
})
