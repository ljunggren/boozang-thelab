// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('TheLab Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/TheLab|Boozang/i);
  });

  test('navigation menu is accessible', async ({ page }) => {
    await page.goto('/');
    const menuButton = page.locator('text=Menu');
    await expect(menuButton).toBeVisible();
  });

  test('speed game page loads', async ({ page }) => {
    await page.goto('/speedGame');
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
  });

  test('cat shelter page loads', async ({ page }) => {
    await page.goto('/catshelter');
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
  });
});
