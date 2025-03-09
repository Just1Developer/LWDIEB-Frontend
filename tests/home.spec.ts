import { expect, test } from '@playwright/test'
import { PRESENTATION_MODE } from '../playwright.config'

test('homepage should have correct title', async ({ page }) => {
  try {
    await page.goto('/')
    await expect(page).toHaveTitle('DIEB - Dashboard')
  } catch (error) {
    if (!PRESENTATION_MODE) throw error
  }
})
