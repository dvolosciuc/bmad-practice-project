import { test, expect } from '@playwright/test'

test.describe('999.md EV listings iframe', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('iframe is present in the next-steps section', async ({ page }) => {
    const iframe = page.locator('#ev-999-iframe')
    await expect(iframe).toBeAttached()
  })

  test('page does not auto-scroll to the iframe on load', async ({ page }) => {
    // On load the viewport should show the hero, not the bottom iframe
    const hero = page.locator('#hero')
    await expect(hero).toBeInViewport()

    // The iframe section should NOT be in viewport on initial load
    const nextSteps = page.locator('#next-steps')
    await expect(nextSteps).not.toBeInViewport()
  })

  test('external "Browse EV listings" link points to the correct URL', async ({ page }) => {
    // Scroll the section into view first
    await page.locator('#next-steps').scrollIntoViewIfNeeded()

    const link = page.locator('a[href*="999.md"]').first()
    await expect(link).toHaveAttribute(
      'href',
      'https://999.md/ro/list/transport/cars?o_4_151=12617',
    )
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noopener/)
  })
})
