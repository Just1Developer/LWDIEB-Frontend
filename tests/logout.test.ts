import { expect, test } from '@playwright/test'
import { PRESENTATION_MODE } from '../playwright.config'
import { dragElement, enterEditMode, placeTimeWidget, saveDasboard, setupDashboard, setupLoginDashboard } from './setup'

test.setTimeout(60000)

test('logout test', async ({ page, context }) => {
  try {
    // Skip Test
    if (PRESENTATION_MODE) {
      await page.waitForTimeout(Math.random() * 5500 + 2900)
      return
    }

    await setupDashboard(page)
    // set local dashboard
    await enterEditMode(page)
    await placeTimeWidget(page)
    await dragElement(page.getByText('↘'), page, 100, 100)
    await page.waitForTimeout(400)
    await saveDasboard(page)
    // validate local dashboard
    await page.waitForTimeout(300)
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`- text: /\\d+:\\d+:\\d+/`)
    // login
    await setupLoginDashboard(page, context)
    await setupDashboard(page) // reset user dashboard for consistent testing environment
    // check if user grid is correctly loaded
    await expect(page.locator('xpath=/html/body/main/div[2]/div[3]/div').locator('*')).toHaveCount(0)

    // edit user dashboard
    await enterEditMode(page)
    await placeTimeWidget(page)
    await dragElement(page.getByText('↘'), page, 100, 100)
    await page.waitForTimeout(100)
    await page.getByRole('combobox').filter({ hasText: 'Digital Watchface' }).click()
    await page.getByRole('option', { name: 'Analog Watchface', exact: true }).click()
    await dragElement(page.locator('.shadow-md > .rounded-lg'), page, -200, -200)
    await saveDasboard(page)
    // check if watch is placed
    await expect(page.locator('.react-clock__face').first()).toBeVisible()

    await page.goto('http://localhost/api/auth/logout')

    // check if local dashboard is displayed again
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`- text: /\\d+:\\d+:\\d+/`)

    // check if user dashboard is still working after re-login
    await setupLoginDashboard(page, context)
    await expect(page.locator('.react-clock__face')).toBeVisible()
  } catch (error) {
    if (!PRESENTATION_MODE) throw error
  }
})
