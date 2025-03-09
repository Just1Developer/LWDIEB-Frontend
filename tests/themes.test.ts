import { expect, test } from '@playwright/test'
import { PRESENTATION_MODE } from '../playwright.config'
import { assertColour, openDashboardSidebar, setupLoginDashboard } from './setup'

test.setTimeout(60000)

test('themes test', async ({ page, context }) => {
  try {
    await setupLoginDashboard(page, context)
    const themeMode = await page.locator('html').evaluate((el) => el.getAttribute('style'))

    await page.waitForTimeout(300)

    if (themeMode === 'color-scheme: dark;') {
      await openDashboardSidebar(page)
      await page.getByRole('button', { name: 'Toggle theme' }).click({ clickCount: 2, delay: 100 })
      await page.locator('.fixed').first().click()
    }

    await openDashboardSidebar(page)
    await page.getByRole('link', { name: 'Customize Themes' }).click()
    await page.getByRole('button', { name: 'Reset to Default Light Theme' }).click()
    await page.getByRole('button', { name: 'Reset to Default Dark Theme' }).click()
    // set dark theme
    await page.getByText('#0B0C0E').click()
    await page.getByRole('textbox').fill('#252525')
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByText('#131517').click()
    await page.getByRole('textbox').fill('#005252')
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByText('#2A2D32').click()
    await page.getByRole('textbox').fill('#c2e8ff')
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByText('#E3E5E8').click()
    await page.getByRole('textbox').fill('#0062ff')
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByText('#DCDDDE').click()
    await page.getByRole('textbox').fill('#ffffff')
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByRole('button', { name: 'Save Theme' }).nth(1).click()

    // evaluate dark theme button
    expect(
      await page
        .getByRole('button', { name: 'Save Theme' })
        .first()
        .evaluate((el) => getComputedStyle(el).backgroundColor),
    ).toBe('rgb(29, 29, 35)')
    await assertColour(page.getByRole('button', { name: 'Save Theme' }).first(), 'rgb(243, 243, 243)')

    // set light theme
    //await page.waitForTimeout(200)
    await page.getByText('#F2F3F5').click()
    await page.getByRole('textbox').first().click()
    await page.getByRole('textbox').fill('#ffb5b5')
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByText('#FFFFFF').first().click()
    await page.getByRole('textbox').fill('#ff9e9e')
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByText('#1d1d23').click()
    await page.getByRole('textbox').fill('#830000')
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByText('#f3f3f3').click()
    await page.getByRole('textbox').fill('#ffe4e4')
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByText('#2E3338').click()
    await page.getByRole('textbox').fill('#272727')
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByRole('button', { name: 'Save Theme' }).first().click()

    // evaluate light theme button
    expect(
      await page
        .getByRole('button', { name: 'Save Theme' })
        .nth(1)
        .evaluate((el) => getComputedStyle(el).backgroundColor),
    ).toBe('rgb(194, 232, 255)')
    await assertColour(page.getByRole('button', { name: 'Save Theme' }).nth(1), 'rgb(0, 98, 255)')

    await openDashboardSidebar(page)
    await page.getByRole('link', { name: 'View Dashboard' }).click()
    const text = page.locator('xpath=/html/body/div[2]/div/div[1]/div[1]/div/p')
    const widgetBackground = page.locator('xpath=/html/body/main/div[2]/div[2]/div/div/div/div')

    // assert light theme in theme editor
    expect(await page.locator('xpath=/html/body/main/div[2]/div[1]').evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
      'rgba(0, 0, 0, 0)',
    )
    expect(await widgetBackground.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(255, 158, 158)')
    expect(await page.locator('xpath=/html/body/main/div[2]/div[2]/div/div/div').evaluate((el) => getComputedStyle(el).borderColor)).toBe(
      'rgba(0, 0, 0, 0)',
    )
    await openDashboardSidebar(page)
    await assertColour(text, 'rgb(39, 39, 39)')

    // switch theme
    await page.getByRole('button', { name: 'Toggle theme' }).click()

    // assert dark theme in theme editor
    await page.locator('xpath=/html/body/div[1]/div').click()
    expect(await page.locator('xpath=/html/body/main').evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(37, 37, 37)')
    await assertColour(widgetBackground, 'rgb(255, 255, 255)')

    await openDashboardSidebar(page)
    await page.getByRole('link', { name: 'Customize Themes' }).click()
    await page.getByRole('button', { name: 'Reset to Default Light Theme' }).click()
    await page.getByRole('button', { name: 'Reset to Default Dark Theme' }).click()
    await page.getByRole('button', { name: 'Save Theme' }).first().click()
    await page.getByRole('button', { name: 'Save Theme' }).nth(1).click()
    await page.waitForTimeout(200)
    await openDashboardSidebar(page)
    await page.getByRole('link', { name: 'View Dashboard' }).click()

    await page.waitForTimeout(200)
    expect(await page.locator('xpath=/html/body/main').evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(11, 12, 14)')
  } catch (error) {
    if (!PRESENTATION_MODE) throw error
  }
})
