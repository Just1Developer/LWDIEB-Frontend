import { BrowserContext, expect, Locator, Page } from '@playwright/test'

export async function openDashboardSidebar(page: Page) {
  await page.locator('div[aria-haspopup="dialog"]').hover()
  await page.getByRole('dialog', { name: 'Sidebar' }).waitFor({ state: 'visible' })
}

export async function openEditSidebar(page: Page) {
  await page.locator('xpath=/html/body/main/div/div/div/div/div/div[2]').first().hover()
  await page.getByRole('dialog', { name: 'Title (required but hidden)' }).waitFor({ state: 'visible' })
}

export async function enterEditMode(page: Page) {
  await page.waitForLoadState('domcontentloaded')
  await openDashboardSidebar(page)
  await page.getByRole('link', { name: 'Edit Dashboard' }).click()
}

export async function saveDasboard(page: Page) {
  await page.waitForTimeout(200)
  await openEditSidebar(page)
  await page.getByText('Save Dashboard').click()
  await page.waitForTimeout(1000)
}

export async function dragElement(locator: Locator, page: Page, x: number, y: number) {
  const box = await locator.boundingBox()
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 + x, box.y + box.height / 2 + y)
    await page.mouse.up()
  }
}

export async function setupDashboard(page: Page) {
  await page.goto('http://localhost/')
  await enterEditMode(page)
  await openEditSidebar(page)
  await page.getByText('Erase Custom Dashboard').click()
  await page.getByRole('button', { name: 'I understand. Erase my' }).click()
  await page.waitForTimeout(500)
  await enterEditMode(page)
  await page.getByRole('img').first().click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await saveDasboard(page)
  await page.waitForTimeout(500)
}

export async function assertColour(locator: Locator, colourString: String) {
  const colour = await locator.evaluate((el) => getComputedStyle(el).color)
  expect(colour).toBe(colourString)
}

export async function placeTimeWidget(page: Page) {
  await openEditSidebar(page)
  await page.locator('.aspect-square').first().click()
  await page.locator('xpath=/html/body/main/div/div/div').click()
  await page.waitForTimeout(1000)
  await openEditSidebar(page)
  await page.locator('.aspect-square').first().click()
  await page.locator('xpath=/html/body/main/div/div/div').click()
}

export async function setupLoginDashboard(page: Page, context: BrowserContext) {
  const cookieSettings = {
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'Lax' as const,
    expires: Math.floor(Date.now() / 1000) + 3600, // 1-hour expiry
  }

  await context.addCookies([
    {
      name: 'id_token',
      value:
        'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJMZTlRMGRMU2tPRGVNU0s1SGI5NFZ4dFFSczVGaWNNYXFQLUhSUE9NczdjIn0.eyJleHAiOjM4ODc5ODE0OTQsImlhdCI6MTc0MDUxNzg4OCwiYXV0aF90aW1lIjoxNzQwNTE3ODg4LCJqdGkiOiI2MTEzODQyOS1kMDg0LTQzZDktODA0ZS1jZGE2N2U2YTg3Y2YiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0L3JlYWxtcy9raXQtZGFzaGJvYXJkIiwiYXVkIjoic3ByaW5nLWNsaWVudCIsInN1YiI6IjkyYjQ1MzE1LTIzNzAtNDMyNy05ZGQ5LTYyZTk4NTFlZTgxMCIsInR5cCI6IklEIiwiYXpwIjoic3ByaW5nLWNsaWVudCIsInNpZCI6ImU5MmU2MzExLTBiMDgtNDRjMS1iMjQzLTQ0NmU2MzE4MWRlYyIsImF0X2hhc2giOiJOeE50MExWSXNiZmZhcmQ4ZENfNldnIiwiYWNyIjoiMSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiUFNFIERJRUIgVGVzdHVzZXIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJkaWViLnRlc3RlckBnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiUFNFIERJRUIiLCJmYW1pbHlfbmFtZSI6IlRlc3R1c2VyIiwiZW1haWwiOiJkaWViLnRlc3RlckBnbWFpbC5jb20ifQ.clBu4ZRaY5T-v5KYyzOeORVedtaiuaIOyO8SGjNbSe5v4GzUMjncfTn9MSEiVya7JNhihVVep1ksUrsh6Z5Bd3oPpbDQ_YVDTWAtFoTild_OeGL0muqx4d0qfHVsUkGukGZoqa_ag5jnLrhMWlAKC7M9wHPfFflYm2X5u4rVzx3lGLojRUXFHRHBeE6lTCkuJ2R9Ls9DJbC2oujYbBOQdo-idRCIPhhbWl8Vwe3TFmyMCjmXBw8iBBbrSeB_yquIqfo4HJHGUndYrBlMqYgq3Urghwfz6irlbonvM8kJ7xZ_QRDT9bnjH03514c--KhjbYkP0dcFn3mSejJ3S5HqIQ',
      ...cookieSettings,
    },
    {
      name: 'access_token',
      value:
        'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJMZTlRMGRMU2tPRGVNU0s1SGI5NFZ4dFFSczVGaWNNYXFQLUhSUE9NczdjIn0.eyJleHAiOjM4ODc5ODE0OTQsImlhdCI6MTc0MDUxNzg4OCwiYXV0aF90aW1lIjoxNzQwNTE3ODg4LCJqdGkiOiI2MjkzODM4Mi0xMzE2LTQ4OGItYTU0NS1lMmM2OTA2NGQ3OGYiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0L3JlYWxtcy9raXQtZGFzaGJvYXJkIiwiYXVkIjpbInNwcmluZy1jbGllbnQiLCJhY2NvdW50Il0sInN1YiI6IjkyYjQ1MzE1LTIzNzAtNDMyNy05ZGQ5LTYyZTk4NTFlZTgxMCIsInR5cCI6IkJlYXJlciIsImF6cCI6InNwcmluZy1jbGllbnQiLCJzaWQiOiJlOTJlNjMxMS0wYjA4LTQ0YzEtYjI0My00NDZlNjMxODFkZWMiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3QiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLWtpdC1kYXNoYm9hcmQiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJQU0UgRElFQiBUZXN0dXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6ImRpZWIudGVzdGVyQGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJQU0UgRElFQiIsImZhbWlseV9uYW1lIjoiVGVzdHVzZXIiLCJlbWFpbCI6ImRpZWIudGVzdGVyQGdtYWlsLmNvbSJ9.GcCoRdjEjWOtwGsoyjlJR2prEkNuuw1zyuRozr2mKrrYwlG_TDQt-bXDXSQFp48d08Nk_qyh7o6sLvbS_q0OhycGV-j0svY78eA4ClUlOgpKWrLNcfFV2xV-gLsIYObtDxaOIeK4tDrMG5XqQhwkhJmGGK752Gf6w1j2xi-J9rXCtvjcxOkW9UvmsQXUsNKBgdifveBblwHJSWP6atZrA19eOiSoc30qGvPc-uAFtSQSPkNN4Z6Fj6sT8nUENfn_6k3sIjedcylCNPc5slK1hcoUFM3H9g7-Hf0Tzve92rMIbCqYHxhadFnEgwtHwkIoLjlSGcE2MG8d5hLH9rhmBg',
      ...cookieSettings,
    },
    {
      name: 'refresh_token',
      value:
        'eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyYzdlNTRiNS1lOWM5LTQzNGItYTQ5ZC1jOTExYTU0ZjA0YzgifQ.eyJleHAiOjM4ODc5ODE0OTQsImlhdCI6MTc0MDUxNzg4OCwianRpIjoiOTgxYTYxMmQtMDRmOS00NzI5LWE5YWItM2YzNWJiZDJlZTA5IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdC9yZWFsbXMva2l0LWRhc2hib2FyZCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QvcmVhbG1zL2tpdC1kYXNoYm9hcmQiLCJzdWIiOiI5MmI0NTMxNS0yMzcwLTQzMjctOWRkOS02MmU5ODUxZWU4MTAiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoic3ByaW5nLWNsaWVudCIsInNpZCI6ImU5MmU2MzExLTBiMDgtNDRjMS1iMjQzLTQ0NmU2MzE4MWRlYyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgd2ViLW9yaWdpbnMgcm9sZXMgYWNyIGVtYWlsIGJhc2ljIn0.v-3lEjSr2r-zJJq5uw_PCZFkViTOYkknNSiDRq7Qo_aTJb08MBG7CNCtjJJSn_g3_mt0UvHS65Hwb3KPfmz2JQ',
      ...cookieSettings,
    },
    { name: 'JSESSIONID', value: 'C3A00899DB629D6E8E926AD29C67C651', ...cookieSettings },
  ])

  await page.goto('http://localhost/')
}
