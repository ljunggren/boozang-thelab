const { test, expect } = require('@playwright/test');

test.describe('MultiScramble', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/multiScramble');
  });

  test('should display the form with input fields and buttons on page load', async ({ page }) => {
    const form = page.locator('[data-testid="multiscramble-form"]');
    await expect(form).toBeVisible();

    const addInput = page.locator('[data-testid="add-input"]');
    const deleteInput = page.locator('[data-testid="delete-input"]');
    await expect(addInput).toBeVisible();
    await expect(deleteInput).toBeVisible();

    const btnSection = page.locator('[data-testid="btn-section"]');
    await expect(btnSection).toBeVisible();

    const buttons = btnSection.locator('input[type="button"]');
    await expect(buttons).toHaveCount(6);
  });

  test('should show default button values on load', async ({ page }) => {
    await expect(page.locator('[data-testid="add-koala"]')).toHaveValue('Add Koala');
    await expect(page.locator('[data-testid="add-kangaroo"]')).toHaveValue('Add Kangaroo');
    await expect(page.locator('[data-testid="add-dolphin"]')).toHaveValue('Add Dolphin');
    await expect(page.locator('[data-testid="delete-koala"]')).toHaveValue('Delete Koala');
    await expect(page.locator('[data-testid="delete-kangaroo"]')).toHaveValue('Delete Kangaroo');
    await expect(page.locator('[data-testid="delete-dolphin"]')).toHaveValue('Delete Dolphin');
  });

  test('should update Add buttons when changing the Add input', async ({ page }) => {
    const addInput = page.locator('[data-testid="add-input"]');
    await addInput.clear();
    await addInput.fill('Create');

    await expect(page.locator('[data-testid="add-koala"]')).toHaveValue('Create Koala');
    await expect(page.locator('[data-testid="add-kangaroo"]')).toHaveValue('Create Kangaroo');
    await expect(page.locator('[data-testid="add-dolphin"]')).toHaveValue('Create Dolphin');
  });

  test('should update Delete buttons when changing the Delete input', async ({ page }) => {
    const deleteInput = page.locator('[data-testid="delete-input"]');
    await deleteInput.clear();
    await deleteInput.fill('Remove');

    await expect(page.locator('[data-testid="delete-koala"]')).toHaveValue('Remove Koala');
    await expect(page.locator('[data-testid="delete-kangaroo"]')).toHaveValue('Remove Kangaroo');
    await expect(page.locator('[data-testid="delete-dolphin"]')).toHaveValue('Remove Dolphin');
  });

  test('should update both Add and Delete buttons independently', async ({ page }) => {
    const addInput = page.locator('[data-testid="add-input"]');
    const deleteInput = page.locator('[data-testid="delete-input"]');

    await addInput.clear();
    await addInput.fill('Insert');
    await deleteInput.clear();
    await deleteInput.fill('Drop');

    await expect(page.locator('[data-testid="add-koala"]')).toHaveValue('Insert Koala');
    await expect(page.locator('[data-testid="delete-koala"]')).toHaveValue('Drop Koala');
    await expect(page.locator('[data-testid="add-kangaroo"]')).toHaveValue('Insert Kangaroo');
    await expect(page.locator('[data-testid="delete-kangaroo"]')).toHaveValue('Drop Kangaroo');
  });
});
