import { test, expect } from '@playwright/test'

test.describe('Hero section — calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows a monetary loss headline on load', async ({ page }) => {
    // The loss headline is an h1 with an MDL currency amount
    const headline = page.getByRole('heading', { level: 1 })
    await expect(headline).toBeVisible()
    // ro-MD locale formats MDL as 'L' with a narrow no-break space (U+202F) before it
    await expect(headline).toContainText(/\d[.,]\d+\s*L/)
  })

  test('recalculates headline when km/month slider changes', async ({ page }) => {
    const headline = page.getByRole('heading', { level: 1 })
    const before = await headline.innerText()

    // Move km/month slider to minimum (300 km) — use the range input directly
    const slider = page.locator('#km-per-month')
    await slider.fill('300')
    await slider.dispatchEvent('input')

    const after = await headline.innerText()
    expect(after).not.toEqual(before)
  })

  test('switches fuel type and recalculates', async ({ page }) => {
    const headline = page.getByRole('heading', { level: 1 })
    const before = await headline.innerText()

    // Switch from Benzina 95 (default) to Motorina (SegmentedControl renders buttons)
    await page.getByRole('button', { name: /motorin/i }).click()

    const after = await headline.innerText()
    expect(after).not.toEqual(before)
  })

  test('switches charging mode and recalculates', async ({ page }) => {
    const headline = page.getByRole('heading', { level: 1 })
    const before = await headline.innerText()

    await page.getByRole('button', { name: /AC public|public.*ac/i }).click()

    const after = await headline.innerText()
    expect(after).not.toEqual(before)
  })

  test('shows ANRE freshness banner with a date', async ({ page }) => {
    // Banner shows "Fuel prices as of DD Mon YYYY" (or Romanian equivalent)
    const banner = page.locator('.flex.items-center.gap-2.py-1')
    await expect(banner).toBeVisible()
    await expect(banner).toContainText(/202\d/)
  })
})
