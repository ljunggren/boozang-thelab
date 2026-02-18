const { test, expect } = require('@playwright/test');

test.describe.configure({ mode: 'serial' });

test.describe('SortedList', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sortedList');
  });

  test('should display the todo list loaded from the server', async ({ page }) => {
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });
    const todos = page.locator('[data-testid="todo"]');
    await expect(todos.first()).toBeVisible();
    const count = await todos.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should add a new todo item', async ({ page }) => {
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });

    let initialCount = await page.locator('[data-testid="todo"]').count();

    // Ensure there is capacity (<5) to add a new todo
    if (initialCount >= 5) {
      await page.locator('[data-testid="todo"]').first().locator('button[title="delete"]').click();
      await expect(page.locator('[data-testid="todo"]')).toHaveCount(initialCount - 1);
      initialCount = initialCount - 1;
    }

    await page.fill('.list_form input[type="text"]', 'New E2E Todo');
    await page.click('button.form_btn.add');

    await expect(page.locator('[data-testid="todo"]')).toHaveCount(initialCount + 1);
    await expect(page.locator('[data-testid="todo"]').last()).toContainText('New E2E Todo');
  });

  test('should delete a todo item', async ({ page }) => {
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });

    const initialCount = await page.locator('[data-testid="todo"]').count();

    await page.locator('[data-testid="todo"]').first().locator('button[title="delete"]').click();

    await expect(page.locator('[data-testid="todo"]')).toHaveCount(initialCount - 1);
  });

  test('should show full schedule message when 5 todos exist', async ({ page }) => {
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });

    const currentCount = await page.locator('[data-testid="todo"]').count();
    const todosToAdd = 5 - currentCount;

    for (let i = 0; i < todosToAdd; i++) {
      await page.fill('.list_form input[type="text"]', `Todo item ${i + 1}`);
      await page.click('button.form_btn.add');
      await page.waitForTimeout(300);
    }

    await expect(page.locator('.error')).toContainText('Your schedule is full!');
  });
});
