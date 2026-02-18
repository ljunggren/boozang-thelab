const { test, expect } = require('@playwright/test');

test.describe('NotFound', () => {
  test('should render NotFound component for invalid route', async ({ page }) => {
    await page.goto('/this-does-not-exist');

    const notFound = page.locator('.not_found');
    await expect(notFound).toBeVisible();

    await expect(notFound.locator('h1')).toContainText('Sorry');
    await expect(notFound.locator('p')).toContainText('That page cannot be found');
  });

  test('should have a link back to home that works', async ({ page }) => {
    await page.goto('/this-does-not-exist');

    const homeLink = page.locator('.not_found a[href="/"]');
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toContainText('Back to Home');

    await homeLink.click();
    await expect(page).toHaveURL('http://localhost:3000/');
  });
});
