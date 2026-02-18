const { test, expect } = require('@playwright/test');

test.describe('SpeedGame', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/speedGame');
  });

  test('should display the start button initially', async ({ page }) => {
    await expect(page.locator('[data-testid="startBtn"]')).toBeVisible();
    await expect(page.locator('[data-testid="startBtn"]')).toHaveText('Start Game');
  });

  test('should show end button after timer goes negative', async ({ page }) => {
    test.setTimeout(30000);

    await page.click('[data-testid="startBtn"]');

    const endBtn = page.locator('button.form_btn.delete');
    await expect(endBtn).toBeVisible({ timeout: 15000 });
    await expect(endBtn).toHaveText('End Game');
  });

  test('should show success message after clicking end game', async ({ page }) => {
    test.setTimeout(30000);

    await page.click('[data-testid="startBtn"]');

    const endBtn = page.locator('button.form_btn.delete');
    await expect(endBtn).toBeVisible({ timeout: 15000 });
    await endBtn.click();

    const result = page.locator('[data-testid="result"]');
    await expect(result).toHaveClass(/show/);

    const message = page.locator('[data-testid="message"]');
    await expect(message).toHaveText('Success');

    await expect(page.locator('.sub_message')).toBeVisible();
    await expect(page.locator('.sub_message')).toContainText('Your reaction time is');
  });
});
