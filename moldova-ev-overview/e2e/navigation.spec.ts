import { test, expect } from '@playwright/test'

test.describe('Sticky header navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('header is visible on load', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible()
  })

  test('nav link scrolls to the savings section', async ({ page }) => {
    // Click "Economii" / "Savings" nav link
    await page.locator('header a[href="#savings"]').click()

    // The savings section should now be in view
    const savings = page.locator('#savings')
    await expect(savings).toBeInViewport({ ratio: 0.2 })
  })

  test('nav link scrolls to the charging section', async ({ page }) => {
    await page.locator('header a[href="#charging"]').click()
    await expect(page.locator('#charging')).toBeInViewport({ ratio: 0.2 })
  })

  test('"Buy an EV" nav link scrolls to the next-steps section', async ({ page }) => {
    await page.locator('header a[href="#next-steps"]').click()
    await expect(page.locator('#next-steps')).toBeInViewport({ ratio: 0.2 })
  })

  test('skip-to-content link is focusable and functional', async ({ page }) => {
    // Tab to skip link then follow it
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    // main content should be in view
    await expect(page.locator('#main-content')).toBeInViewport()
  })
})
