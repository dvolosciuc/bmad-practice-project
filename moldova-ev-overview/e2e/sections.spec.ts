import { test, expect } from '@playwright/test'

test.describe('Savings section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('savings section is present', async ({ page }) => {
    await expect(page.locator('#savings')).toBeAttached()
  })

  test('5-year savings figure is displayed', async ({ page }) => {
    await page.locator('#savings').scrollIntoViewIfNeeded()
    // ro-MD locale formats MDL as 'L' with a narrow no-break space (U+202F) before it
    const section = page.locator('#savings')
    await expect(section).toContainText(/\d[.,]\d+\s*L/)
  })

  test('maintenance callout note is visible', async ({ page }) => {
    await page.locator('#savings').scrollIntoViewIfNeeded()
    // The callout mentions moving parts or maintenance
    const callout = page.locator('#savings').getByText(/moving parts|piese mobile/i)
    await expect(callout).toBeVisible()
  })
})

test.describe('CO2 section', () => {
  test('CO2 section is present and shows kg value', async ({ page }) => {
    await page.goto('/')
    await page.locator('#co2').scrollIntoViewIfNeeded()
    const section = page.locator('#co2')
    await expect(section).toContainText(/kg/i)
  })
})

test.describe('Community banner', () => {
  test('shows the 10,000+ stat', async ({ page }) => {
    await page.goto('/')
    // Find the community section by the stat value
    await expect(page.getByText(/10[.,]000\+/)).toBeVisible()
  })
})
