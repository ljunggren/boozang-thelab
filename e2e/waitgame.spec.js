const { test, expect } = require('@playwright/test');

test.describe('WaitGame', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/waitGame');
  });

  test('should display start button initially', async ({ page }) => {
    await expect(page.locator('[data-testid="startBtn"]')).toBeVisible();
    await expect(page.locator('[data-testid="startBtn"]')).toHaveText('Start Game');
  });

  test('should show end button after starting the game', async ({ page }) => {
    await page.click('[data-testid="startBtn"]');

    await expect(page.locator('button.form_btn.delete')).toBeVisible();
    await expect(page.locator('button.form_btn.delete')).toHaveText('End Game');
  });

  test('should show failure when stopping before 5 seconds', async ({ page }) => {
    await page.click('[data-testid="startBtn"]');
    await page.waitForTimeout(1000);
    await page.click('button.form_btn.delete');

    const result = page.locator('[data-testid="result"]');
    await expect(result).toHaveClass(/show/);

    const message = page.locator('[data-testid="message"]');
    await expect(message).toHaveText('Try again!');
    await expect(message).toHaveClass(/fail/);
  });

  test('should show success when stopping after 5 seconds', async ({ page }) => {
    test.setTimeout(15000);

    await page.click('[data-testid="startBtn"]');
    await page.waitForTimeout(5500);
    await page.click('button.form_btn.delete');

    const result = page.locator('[data-testid="result"]');
    await expect(result).toHaveClass(/show/);

    const message = page.locator('[data-testid="message"]');
    await expect(message).toHaveText('Success!');
    await expect(message).not.toHaveClass(/fail/);

    await expect(page.locator('.sub_message')).toBeVisible();
    await expect(page.locator('.sub_message')).toContainText('ms above 5 seconds');
  });
});
