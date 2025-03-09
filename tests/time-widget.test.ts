import { expect, test } from '@playwright/test'
import { PRESENTATION_MODE } from '../playwright.config'
import { dragElement, enterEditMode, placeTimeWidget, saveDasboard, setupDashboard } from './setup'

test.setTimeout(60000)

test('time widget functionality test', async ({ page }) => {
  try {
    await setupDashboard(page)
    await enterEditMode(page)
    // place watch widget
    await placeTimeWidget(page)

    await dragElement(page.getByText('↘'), page, 100, 100)
    // check if watch widget is displayed correctly
    await expect(page.locator('[id="relative\\ grid-parent"]')).toContainText(/[0-9]?[0-9]:\d{2}:\d{2}/)
    await expect(page.getByRole('heading')).toContainText('Select Digital clock style')
    await expect(page.locator('select')).toBeVisible()
    await page.getByRole('combobox').filter({ hasText: 'Digital Watchface' }).click()
    await expect(page.getByRole('option', { name: 'Digital Watchface', exact: true })).toBeVisible()
    await expect(page.getByRole('option', { name: 'Digital Watchface and Date' })).toBeVisible()
    await expect(page.getByRole('option', { name: 'Analog Watchface', exact: true })).toBeVisible()
    await expect(page.getByRole('option', { name: 'Analog Watchface and Date' })).toBeVisible()
    await page.getByRole('option', { name: 'Digital Watchface', exact: true }).click()
    await expect(page.getByRole('combobox').filter({ hasText: 'Digital Watchface' })).toBeVisible()
    await page.locator('[id="relative\\ grid-parent"] div').first().click()
    // check digital watchface display
    await saveDasboard(page)
    await page.waitForTimeout(1000)
    await expect(page.getByRole('main')).toContainText(/[0-9]?[0-9]:\d{2}:\d{2}/)
    await enterEditMode(page)
    await page.locator('select').selectOption('minutes')
    await expect(page.locator('[id="relative\\ grid-parent"]')).toContainText(/[0-9]?[0-9]:\d{2}/)
    await saveDasboard(page)
    await expect(page.getByRole('main')).toContainText(/[0-9]?[0-9]:\d{2}/)
    // check digital watchface and date display
    await enterEditMode(page)
    await page.getByRole('combobox').filter({ hasText: 'Digital Watchface' }).click()
    await page.getByRole('option', { name: 'Digital Watchface and Date' }).click()
    await expect(page.getByText(/[0-9]?[0-9]\/\d{2}\/\d{4}$/)).toBeVisible()
    await saveDasboard(page)
    await expect(page.getByRole('main')).toContainText(/[0-9]?[0-9]:[0-9][0-9][0-9]?[0-9]\/\d{2}\/\d{4}/)
    // check analog watchface
    await enterEditMode(page)
    await page.getByRole('combobox').filter({ hasText: 'Digital Watchface and Date' }).click()
    await page.getByRole('option', { name: 'Analog Watchface', exact: true }).click()
    await expect(page.locator('.react-clock__face')).toBeVisible()
    await saveDasboard(page)
    await expect(page.locator('.react-clock__face')).toBeVisible()
    // check analog watchface and date
    await enterEditMode(page)
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: 'Analog Watchface and Date' }).click()
    await expect(page.locator('.react-clock__face')).toBeVisible()
    await expect(page.locator('[id="relative\\ grid-parent"]')).toContainText(/[0-9]?[0-9]\/\d{2}\/\d{4}/g)
    await saveDasboard(page)
    await expect(page.locator('.react-clock__face')).toBeVisible()
    await expect(page.getByRole('main')).toContainText(/[0-9]?[0-9]\/\d{2}\/\d{4}/g)
  } catch (error) {
    if (!PRESENTATION_MODE) throw error
  }
})
