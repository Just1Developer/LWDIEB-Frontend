import { defineConfig } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

// all tests have to be run on production builds! dev servers are too inconsistent

export const PRESENTATION_MODE = 1 == 1

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost',
    headless: false,
    viewport: { width: 950, height: 600 },
    launchOptions: {
      slowMo: 400,
    },
  },
  webServer: {
    command: 'pnpm start',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: true,
  },
  workers: PRESENTATION_MODE ? 1 : 1,
})
