const { test, expect } = require('@playwright/test');

test.describe.configure({ mode: 'serial' });

let addedCatName;

test.describe('CatShelter', () => {
  test('should display the cat list loaded from the server', async ({ page }) => {
    await page.goto('/catshelter');
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });
    const cats = page.locator('.collection .collection_item');
    await expect(cats.first()).toBeVisible();
    const count = await cats.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should add a new cat via the add cat form', async ({ page }) => {
    addedCatName = 'E2E Test Cat ' + Date.now();

    await page.goto('/addcat');
    await page.fill('input[name="name"]', addedCatName);
    await page.fill('textarea[name="description"]', 'A friendly test cat');
    await page.click('input[name="inOrOutside"][value="inside"]');
    await page.click('button.form_btn.add');

    await page.waitForURL('**/catshelter');
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });
    await expect(page.locator('.collection')).toContainText(addedCatName);
  });

  test('should view cat details when clicking a cat in the list', async ({ page }) => {
    await page.goto('/catshelter');
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });

    const catLink = page.locator('.cat_name_link', { hasText: addedCatName });
    await expect(catLink).toBeVisible();
    await catLink.click();

    await expect(page.locator('h1')).toContainText('Cat details');
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });
    await expect(page.locator('input.name')).toHaveValue(addedCatName);
    await expect(page.locator('textarea[name="description"]')).toHaveValue('A friendly test cat');
    await expect(page.locator('input[name="inOrOutside"][value="inside"]')).toBeChecked();
  });

  test('should edit cat details and persist changes', async ({ page }) => {
    await page.goto('/catshelter');
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });

    const catLink = page.locator('.cat_name_link', { hasText: addedCatName });
    await catLink.click();

    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });

    await page.locator('input.name').fill(addedCatName + ' Updated');
    await page.locator('textarea[name="description"]').fill('Updated description');
    await page.click('input[name="inOrOutside"][value="outside"]');
    await page.click('button.form_btn.add');

    await page.waitForURL('**/catshelter');
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });
    await expect(page.locator('.collection')).toContainText(addedCatName + ' Updated');

    addedCatName = addedCatName + ' Updated';

    const updatedCatLink = page.locator('.cat_name_link', { hasText: addedCatName });
    await updatedCatLink.click();
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });
    await expect(page.locator('input.name')).toHaveValue(addedCatName);
    await expect(page.locator('textarea[name="description"]')).toHaveValue('Updated description');
    await expect(page.locator('input[name="inOrOutside"][value="outside"]')).toBeChecked();
  });

  test('should toggle foundHome status for a cat', async ({ page }) => {
    await page.goto('/catshelter');
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });

    const catItem = page.locator('.collection_item', { hasText: addedCatName });
    await expect(catItem).toBeVisible();
    const homeBtn = catItem.locator('button.new_home');

    const hadFoundClass = await homeBtn.evaluate(el => el.classList.contains('found'));

    await homeBtn.click();
    await page.waitForTimeout(500);

    if (hadFoundClass) {
      await expect(homeBtn).not.toHaveClass(/found/);
    } else {
      await expect(homeBtn).toHaveClass(/found/);
    }

    await homeBtn.click();
    await page.waitForTimeout(500);

    if (hadFoundClass) {
      await expect(homeBtn).toHaveClass(/found/);
    } else {
      await expect(homeBtn).not.toHaveClass(/found/);
    }
  });
});
