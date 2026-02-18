const { test, expect } = require('@playwright/test');

test.describe.configure({ mode: 'serial' });

test.describe('CatDetails', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cats/8');
  });

  test('should display cat details after loading', async ({ page }) => {
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });
    await expect(page.locator('h1')).toHaveText('Cat details');
    await expect(page.locator('input.name')).toBeVisible();
    await expect(page.locator('input.name')).toHaveValue('Filip');
  });

  test('should display the back link to cat shelter', async ({ page }) => {
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });
    const backLink = page.locator('a[aria-label="Back to Cat shelter page"]');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/catshelter');
  });

  test('should allow editing the cat name', async ({ page }) => {
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });
    const nameInput = page.locator('input.name');
    await nameInput.clear();
    await nameInput.fill('Filip Updated');
    await expect(nameInput).toHaveValue('Filip Updated');
  });

  test('should allow editing the description', async ({ page }) => {
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });
    const textarea = page.locator('textarea[name="description"]');
    await expect(textarea).toBeVisible();
    await textarea.clear();
    await textarea.fill('Updated description');
    await expect(textarea).toHaveValue('Updated description');
  });

  test('should display radio buttons for inside/outside', async ({ page }) => {
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });
    const outsideRadio = page.locator('input[type="radio"][value="outside"]');
    const insideRadio = page.locator('input[type="radio"][value="inside"]');
    await expect(outsideRadio).toBeVisible();
    await expect(insideRadio).toBeVisible();
  });

  test('should allow toggling inside/outside radio buttons', async ({ page }) => {
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });
    const insideRadio = page.locator('input[type="radio"][value="inside"]');
    await insideRadio.check();
    await expect(insideRadio).toBeChecked();

    const outsideRadio = page.locator('input[type="radio"][value="outside"]');
    await outsideRadio.check();
    await expect(outsideRadio).toBeChecked();
    await expect(insideRadio).not.toBeChecked();
  });

  test('should display Save and Cancel buttons', async ({ page }) => {
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });
    await expect(page.locator('button.form_btn.add')).toBeVisible();
    await expect(page.locator('button.form_btn.add')).toHaveText('Save');
    await expect(page.locator('button.form_btn.cancel')).toBeVisible();
    await expect(page.locator('button.form_btn.cancel')).toHaveText('Cancel');
  });

  test('should display Delete button', async ({ page }) => {
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });
    await expect(page.locator('button.form_btn.delete')).toBeVisible();
    await expect(page.locator('button.form_btn.delete')).toHaveText('Delete');
  });

  test('should navigate back when Cancel is clicked', async ({ page }) => {
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });
    await page.locator('button.form_btn.cancel').click();
    await expect(page).toHaveURL(/\/catshelter/);
  });

  test('should navigate back when back link is clicked', async ({ page }) => {
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });
    await page.locator('a[aria-label="Back to Cat shelter page"]').click();
    await expect(page).toHaveURL(/\/catshelter/);
  });
});
