import { test, expect } from '@playwright/test';

test.describe('Candidate workflow', () => {
  test('login → create → validate → delete', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('#email', 'admin@test.com');
    await page.fill('#password', 'Admin1234!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/candidates');

    // Create
    await page.click('text=+ Nouveau candidat');
    await page.fill('#firstName', 'E2E');
    await page.fill('#lastName', 'Test');
    await page.fill('#email', `e2e${Date.now()}@test.com`);
    await page.fill('#position', 'QA Engineer');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/candidates');

    // View detail & validate
    await page.click('button[aria-label^="Voir E2E"]');
    await page.click('text=Valider le candidat');
    await expect(page.locator('strong')).toHaveText('validated', { timeout: 10000 });

    // Delete
    await page.goto('/candidates');
    await page.click('button[aria-label^="Supprimer E2E"]');
    page.on('dialog', d => d.accept());
  });
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({ path: `screenshots/${testInfo.title.replace(/\s/g, '_')}.png` });
  }
});