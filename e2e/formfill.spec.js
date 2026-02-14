const { test, expect } = require('@playwright/test');

test.describe('FormFill', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/formFill');
  });

  test('should display the form with all required fields', async ({ page }) => {
    await expect(page.locator('input[name="firstname"]')).toBeVisible();
    await expect(page.locator('input[name="lastname"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button.form_btn.add')).toBeVisible();
  });

  test('should fill and submit the form successfully', async ({ page }) => {
    await page.fill('input[name="firstname"]', 'Test');
    await page.fill('input[name="lastname"]', 'User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');

    await page.click('button.form_btn.add');

    await expect(page.locator('.save_message.show')).toBeVisible();
    await expect(page.locator('.save_message.show')).toHaveText('Data saved to DB');

    await expect(page.locator('input[name="firstname"]')).toHaveValue('');
    await expect(page.locator('input[name="lastname"]')).toHaveValue('');
    await expect(page.locator('input[name="email"]')).toHaveValue('');
    await expect(page.locator('input[name="password"]')).toHaveValue('');
  });

  test('should show error for short password', async ({ page }) => {
    await page.fill('input[name="firstname"]', 'Test');
    await page.fill('input[name="lastname"]', 'User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', '123');

    await page.click('button.form_btn.add');

    await expect(page.locator('.error')).toBeVisible();
    await expect(page.locator('.error')).toContainText('Password needs to be al least 6 characters');
  });

  test('should show and hide users from db', async ({ page }) => {
    await expect(page.locator('button.form_btn.orange')).toHaveText('Show users in db');

    await page.click('button.form_btn.orange');

    await expect(page.locator('.print_form.show')).toBeVisible();
    await expect(page.locator('.print_form.show table tbody tr').first()).toBeVisible();

    await expect(page.locator('button.form_btn.orange')).toHaveText('Hide users in db');

    await page.click('button.form_btn.orange');

    await expect(page.locator('.print_form.show')).not.toBeVisible();
  });
});
