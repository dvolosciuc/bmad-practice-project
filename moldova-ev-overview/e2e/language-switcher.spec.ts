import { test, expect } from '@playwright/test'

test.describe('Language switcher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('page loads in Romanian by default', async ({ page }) => {
    // Playwright locale is set to ro-MD so i18next-browser-languagedetector picks Romanian
    await expect(page.getByText(/Doar combustibil/i)).toBeVisible()
  })

  test('switches to English and updates visible text', async ({ page }) => {
    // Click the EN button in the language switcher
    await page.getByRole('button', { name: /^EN$/i }).click()

    // Hero label should now be in English
    await expect(page.getByText(/Fuel cost only/i)).toBeVisible()
    // Loss prefix should be English
    await expect(page.getByText(/On fuel alone/i)).toBeVisible()
  })

  test('switches back to Romanian from English', async ({ page }) => {
    await page.getByRole('button', { name: /^EN$/i }).click()
    await expect(page.getByText(/Fuel cost only/i)).toBeVisible()

    await page.getByRole('button', { name: /^RO$/i }).click()
    await expect(page.getByText(/Doar combustibil/i)).toBeVisible()
  })

  test('navigation links are translated on language switch', async ({ page }) => {
    // Default locale is Romanian (set in playwright.config.ts)
    const header = page.locator('header')
    await expect(header.getByText(/Economii/i)).toBeVisible()

    await page.getByRole('button', { name: /^EN$/i }).click()
    await expect(header.getByText(/Savings/i)).toBeVisible()
  })

  test('ANRE banner date locale switches with language', async ({ page }) => {
    // Default locale is Romanian; banner shows Romanian month name
    const banner = page.locator('.flex.items-center.gap-2.py-1')
    await expect(banner).toContainText(/Pre[tț]uri combustibil/i)

    await page.getByRole('button', { name: /^EN$/i }).click()
    // After switching to English the label changes
    await expect(banner).toContainText(/Fuel prices as of/i)
  })
})
