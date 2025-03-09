import { expect, test } from '@playwright/test'
import { PRESENTATION_MODE } from '../playwright.config'
import { dragElement, enterEditMode, openEditSidebar, saveDasboard, setupDashboard } from './setup'

test.setTimeout(60000)

test('adaptive card functionality test', async ({ page }) => {
  try {
    await setupDashboard(page)
    // Navigate to the edit page
    await enterEditMode(page)

    // place adaptive cards widget
    await openEditSidebar(page)
    await page.getByText('This is a Custom Widget!').click()
    await page.locator('xpath=/html/body/main/div/div/div').click()
    await page.waitForTimeout(1000)
    await openEditSidebar(page)
    await page.getByText('This is a Custom Widget!').click()
    await page.locator('xpath=/html/body/main/div/div/div').click()

    // Enlarge the widget
    await dragElement(page.getByText('↘'), page, 200, 300)

    // Open the JSON editor for the adaptive card
    await page.getByText('{}').click()
    await page.getByLabel('Edit AdaptiveCards').getByText('{}').click()

    // Fill the adaptive card with invalid JSON content
    await page
      .getByLabel('Edit AdaptiveCards')
      .getByText('{}')
      .fill('hi my life is very nice :) I Love this project\n PSE is a lot of fun :=)')
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Switch to preview mode
    await page.getByRole('combobox').click()
    await page.getByText('Preview').click()

    // Verify that an error message is displayed
    await expect(page.locator('[id="relative\\ grid-parent"]')).toContainText('There was an error reading the adaptive card')

    // Save the dashboard
    await saveDasboard(page)

    // Verify that the invalid widgets dialog is visible
    await expect(page.getByRole('dialog', { name: 'Invalid Widgets' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Save anyway' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible()

    // Cancel the save operation
    await page.getByRole('button', { name: 'Cancel' }).click()

    // Switch back to edit JSON mode
    await page.getByRole('combobox').click()
    await page.getByText('Edit JSON').click()

    // Replace the invalid JSON with valid adaptive card JSON
    await page.getByText('hi my life is very nice :) I').click()
    await page
      .getByLabel('Edit AdaptiveCards')
      .getByText('hi my life is very nice :) I')
      .fill(
        '{ "type": "AdaptiveCard", "body": [ { "type": "TextBlock", "size": "Medium", "weight": "Bolder", "text": "Publish Adaptive Card Schema" }, { "type": "ColumnSet", "columns": [ { "type": "Column", "items": [ { "type": "Image", "style": "Person", "url": "https://pbs.twimg.com/profile_images/3647943215/d7f12830b3c17a5a9e4afcc370e3a37e_400x400.jpeg", "altText": "Matt Hidinger", "size": "Small" } ], "width": "auto" }, { "type": "Column", "items": [ { "type": "TextBlock", "weight": "Bolder", "text": "Matt Hidinger", "wrap": true }, { "type": "TextBlock", "spacing": "None", "text": "Created {{DATE(2017-02-14T06:08:39Z,SHORT)}}", "isSubtle": true, "wrap": true } ], "width": "stretch" } ] }, { "type": "TextBlock", "text": "Now that we have defined the main rules and features of the format, we need to produce a schema and publish it to GitHub. The schema will be the starting point of our reference documentation.", "wrap": true } ], "actions": [ { "type": "Action.ShowCard", "title": "Set due date", "card": { "type": "AdaptiveCard", "body": [ { "type": "Input.Date", "id": "dueDate" }, { "type": "Input.Text", "id": "comment", "placeholder": "Add a comment", "isMultiline": true } ], "actions": [ { "type": "Action.Submit", "title": "OK" } ], "$schema": "http://adaptivecards.io/schemas/adaptive-card.json" } }, { "type": "Action.OpenUrl", "title": "View", "url": "https://adaptivecards.io" } ], "$schema": "http://adaptivecards.io/schemas/adaptive-card.json", "version": "1.6" }',
      )
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Switch to preview mode again
    await page.getByRole('combobox').click()
    await page.getByText('Preview').click()

    // Verify that the adaptive card content is displayed correctly
    await expect(page.locator('[id="relative\\ grid-parent"]')).toContainText(
      'Now that we have defined the main rules and features of the format, we need to produce a schema and publish it to GitHub. The schema will be the starting point of our reference documentation.',
    )
    await page.waitForTimeout(300)
    await expect(page.locator('[id="relative\\ grid-parent"]')).toContainText('Created Tue, Feb 14, 2017')
    await expect(page.locator('[id="relative\\ grid-parent"]')).toContainText('Matt Hidinger')
    await expect(page.locator('[id="relative\\ grid-parent"]')).toContainText('Publish Adaptive Card Schema')
    await expect(page.getByRole('img', { name: 'Matt Hidinger' })).toBeVisible()

    // Save the dashboard again
    await saveDasboard(page)

    await page.waitForTimeout(500)

    // Verify that the adaptive card content is displayed correctly in the main view
    await expect(page.getByRole('main')).toContainText(
      'Now that we have defined the main rules and features of the format, we need to produce a schema and publish it to GitHub. The schema will be the starting point of our reference documentation.',
    )
    await expect(page.getByRole('main')).toContainText('Created Tue, Feb 14, 2017')
    await expect(page.getByRole('main')).toContainText('Matt Hidinger')
    await expect(page.getByRole('main')).toContainText('Publish Adaptive Card Schema')
    await expect(page.getByRole('img', { name: 'Matt Hidinger' })).toBeVisible()
  } catch (error) {
    if (!PRESENTATION_MODE) throw error
  }
})
