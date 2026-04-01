// 




import { test, expect } from '@playwright/test'

test.describe('Candidate workflow', () => {
  test('login → create → validate → delete', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('#email', 'admin@test.com')
    await page.fill('#password', 'Admin1234!')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/candidates', { timeout: 15000 })
    await expect(page).toHaveURL(/candidates/)

    // Create
    await page.click('text=+ Nouveau candidat')
    await page.waitForURL('**/candidates/new', { timeout: 10000 })
    await page.fill('#firstName', 'E2E')
    await page.fill('#lastName', 'Test')
    await page.fill('#email', `e2e${Date.now()}@test.com`)
    await page.fill('#position', 'QA Engineer')
    await page.waitForSelector('button[type="submit"]:not([disabled])')
    await page.click('button[type="submit"]')

    // Attendre redirection
    await page.waitForTimeout(3000)
    await page.waitForURL('**/candidates', { timeout: 15000 })

    // Voir détail
    await page.waitForSelector('text=E2E', { timeout: 10000 })
    await page.click('button[aria-label^="Voir E2E"]')

    // Validate
    await page.waitForSelector('text=Valider le candidat', { timeout: 10000 })
    await page.click('text=Valider le candidat')
    await expect(page.locator('strong')).toHaveText('validated', { timeout: 15000 })

    // Delete
    await page.goto('/candidates')
    await page.waitForSelector('button[aria-label^="Supprimer E2E"]', { timeout: 10000 })
    page.on('dialog', d => d.accept())
    await page.click('button[aria-label^="Supprimer E2E"]')
    await page.waitForTimeout(2000)
    await expect(page.locator('text=E2E')).toHaveCount(0)
  })
})

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({
      path: `screenshots/${testInfo.title.replace(/[\s→]/g, '_')}.png`,
      fullPage: true
    })
  }
})