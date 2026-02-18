const { test, expect } = require('@playwright/test');

test.describe.configure({ mode: 'serial' });

test.describe('UnsortedList', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/unsortedList');
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

  test('should insert new todo at a non-sequential position', async ({ page }) => {
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });

    while (await page.locator('[data-testid="todo"]').count() >= 5) {
      await page.locator('[data-testid="todo"]').first().locator('button[title="delete"]').click();
      await page.waitForTimeout(300);
    }

    const lastTodoBefore = await page.locator('[data-testid="todo"]').last().textContent();

    let insertedAtEnd = 0;
    const attempts = 5;
    for (let i = 0; i < attempts; i++) {
      while (await page.locator('[data-testid="todo"]').count() >= 5) {
        await page.locator('[data-testid="todo"]').first().locator('button[title="delete"]').click();
        await page.waitForTimeout(300);
      }
      const todoText = `Random Position Todo ${i}`;
      await page.fill('.list_form input[type="text"]', todoText);
      await page.click('button.form_btn.add');
      await page.waitForTimeout(300);
      const lastTodoText = await page.locator('[data-testid="todo"]').last().textContent();
      if (lastTodoText.includes(todoText)) {
        insertedAtEnd++;
      }
    }

    expect(insertedAtEnd).toBeLessThan(attempts);
  });

  test('should clear the input field after adding a todo', async ({ page }) => {
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });

    while (await page.locator('[data-testid="todo"]').count() >= 5) {
      await page.locator('[data-testid="todo"]').first().locator('button[title="delete"]').click();
      await page.waitForTimeout(300);
    }

    await page.fill('.list_form input[type="text"]', 'Clear Input Test');
    await page.click('button.form_btn.add');
    await page.waitForTimeout(300);

    await expect(page.locator('.list_form input[type="text"]')).toHaveValue('');
  });

  test('should display each todo with a delete button', async ({ page }) => {
    await expect(page.locator('.loading')).not.toBeVisible({ timeout: 10000 });

    const todos = page.locator('[data-testid="todo"]');
    const count = await todos.count();

    for (let i = 0; i < count; i++) {
      await expect(todos.nth(i).locator('button[title="delete"]')).toBeVisible();
    }
  });
});
