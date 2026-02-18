const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/addcat');
});

test.describe('AddCat page', () => {
  test('displays the page heading', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Add cat');
  });

  test('displays a link back to Cat shelter', async ({ page }) => {
    const backLink = page.locator('a[aria-label="Back to Cat shelter page"]');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/catshelter');
  });

  test('displays the form with name input, description textarea, and radio buttons', async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
    await expect(page.locator('input[name="inOrOutside"][value="outside"]')).toBeVisible();
    await expect(page.locator('input[name="inOrOutside"][value="inside"]')).toBeVisible();
  });

  test('allows typing a name', async ({ page }) => {
    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill('Whiskers');
    await expect(nameInput).toHaveValue('Whiskers');
  });

  test('allows typing a description', async ({ page }) => {
    const descriptionInput = page.locator('textarea[name="description"]');
    await descriptionInput.fill('A fluffy orange cat');
    await expect(descriptionInput).toHaveValue('A fluffy orange cat');
  });

  test('allows selecting the "outside" radio button', async ({ page }) => {
    const outsideRadio = page.locator('input[name="inOrOutside"][value="outside"]');
    await outsideRadio.check();
    await expect(outsideRadio).toBeChecked();
  });

  test('allows selecting the "inside" radio button', async ({ page }) => {
    const insideRadio = page.locator('input[name="inOrOutside"][value="inside"]');
    await insideRadio.check();
    await expect(insideRadio).toBeChecked();
  });

  test('shows the Add Cat submit button', async ({ page }) => {
    await expect(page.locator('button.form_btn.add')).toBeVisible();
    await expect(page.locator('button.form_btn.add')).toHaveText('Add Cat');
  });

  test('shows the Cancel button', async ({ page }) => {
    await expect(page.locator('button.form_btn.cancel')).toBeVisible();
    await expect(page.locator('button.form_btn.cancel')).toHaveText('Cancel');
  });

  test('navigates to /catshelter when Cancel is clicked', async ({ page }) => {
    await page.locator('button.form_btn.cancel').click();
    await expect(page).toHaveURL(/\/catshelter/);
  });

  test('navigates to /catshelter when back link is clicked', async ({ page }) => {
    await page.locator('a[aria-label="Back to Cat shelter page"]').click();
    await expect(page).toHaveURL(/\/catshelter/);
  });

  test('name input is required', async ({ page }) => {
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toHaveAttribute('required', '');
  });

  test('radio buttons are mutually exclusive', async ({ page }) => {
    const outsideRadio = page.locator('input[name="inOrOutside"][value="outside"]');
    const insideRadio = page.locator('input[name="inOrOutside"][value="inside"]');

    await outsideRadio.check();
    await expect(outsideRadio).toBeChecked();
    await expect(insideRadio).not.toBeChecked();

    await insideRadio.check();
    await expect(insideRadio).toBeChecked();
    await expect(outsideRadio).not.toBeChecked();
  });
});
