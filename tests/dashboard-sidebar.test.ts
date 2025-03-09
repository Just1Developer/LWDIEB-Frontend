import { expect, test } from '@playwright/test'
import { PRESENTATION_MODE } from '../playwright.config'

test('dashboard sidebar test', async ({ page }) => {
  try {
    await page.goto('http://localhost/')
    await expect(page.locator('.grid')).toBeVisible()
    await page.locator('div[aria-haspopup="dialog"]').hover()
    await expect(page.getByLabel('Sidebar')).toContainText('Dashboard for Insights and Everyday Briefing')
    await expect(page.getByLabel('Sidebar')).toContainText('→ Login via Google')
    await expect(page.getByLabel('Sidebar')).toContainText('→ Login via KIT')
    await expect(page.getByLabel('Sidebar')).toContainText('Edit Dashboard')
    await expect(page.getByRole('button', { name: 'Toggle theme' })).toBeVisible()
  } catch (error) {
    if (!PRESENTATION_MODE) throw error
  }
})
