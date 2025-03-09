import { expect, test } from '@playwright/test'
import { PRESENTATION_MODE } from '../playwright.config'
import { dragElement, enterEditMode, openEditSidebar, placeTimeWidget, setupDashboard } from './setup'

test('discard changes test', async ({ page }) => {
  try {
    await setupDashboard(page)
    await page.goto('http://localhost/')
    await expect(page.getByRole('main')).toContainText('')
    await enterEditMode(page)
    // place time widget
    await placeTimeWidget(page)
    await dragElement(page.getByText('↘'), page, 100, 100)
    await page.waitForSelector('[id="relative\\ grid-parent"]')
    await page.waitForTimeout(400)
    //discard changes
    await openEditSidebar(page)
    await page.getByText('Discard Changes').click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page.getByRole('main')).toContainText('')
  } catch (error) {
    if (!PRESENTATION_MODE) throw error
  }
})
