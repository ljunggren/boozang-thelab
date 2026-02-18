const { test, expect } = require('@playwright/test');

test.describe('MultiScramble', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/multiScramble');
  });

  test('should display input fields and buttons on page load', async ({ page }) => {
    const form = page.locator('.list_form');
    await expect(form).toBeVisible();

    const inputs = form.locator('input[type="text"]');
    await expect(inputs).toHaveCount(2);

    const btnSection = page.locator('.multiscramble_btn_section');
    await expect(btnSection).toBeVisible();

    const buttons = btnSection.locator('input[type="button"]');
    await expect(buttons).toHaveCount(6);
  });

  test('should update button text when changing Add input value', async ({ page }) => {
    const addInput = page.locator('.list_form input[type="text"]').first();
    await addInput.clear();
    await addInput.fill('Create');

    await expect(page.locator('input[type="button"][value="Create Koala"]')).toBeVisible();
    await expect(page.locator('input[type="button"][value="Create Kangaroo"]')).toBeVisible();
    await expect(page.locator('input[type="button"][value="Create Dolphin"]')).toBeVisible();
  });

  test('should update button text when changing Delete input value', async ({ page }) => {
    const deleteInput = page.locator('.list_form input[type="text"]').nth(1);
    await deleteInput.clear();
    await deleteInput.fill('Remove');

    await expect(page.locator('input[type="button"][value="Remove Koala"]')).toBeVisible();
    await expect(page.locator('input[type="button"][value="Remove Kangaroo"]')).toBeVisible();
    await expect(page.locator('input[type="button"][value="Remove Dolphin"]')).toBeVisible();
  });

  test('should reflect all 6 buttons with correct default values', async ({ page }) => {
    await expect(page.locator('input[type="button"][value="Add Koala"]')).toBeVisible();
    await expect(page.locator('input[type="button"][value="Add Kangaroo"]')).toBeVisible();
    await expect(page.locator('input[type="button"][value="Add Dolphin"]')).toBeVisible();
    await expect(page.locator('input[type="button"][value="Delete Koala"]')).toBeVisible();
    await expect(page.locator('input[type="button"][value="Delete Kangaroo"]')).toBeVisible();
    await expect(page.locator('input[type="button"][value="Delete Dolphin"]')).toBeVisible();
  });
});
