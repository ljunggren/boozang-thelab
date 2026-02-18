const { test, expect } = require('@playwright/test');

test.describe('ScrambleItems', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scramble');
  });

  test('should display scramble buttons on page load', async ({ page }) => {
    const animalBtns = page.locator('.animal_btns');
    await expect(animalBtns).toBeVisible();

    const btnOne = page.locator('input[name="btnOne"]');
    const btnTwo = page.locator('input[name="btnTwo"]');
    await expect(btnOne).toBeVisible();
    await expect(btnTwo).toBeVisible();

    await expect(page.locator('button', { hasText: 'Swap Id' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Swap Class' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Swap Content' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Random Position' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Swap DOM Order' })).toBeVisible();
  });

  test('should swap content when clicking Swap Content', async ({ page }) => {
    const btnOne = page.locator('input[name="btnOne"]');
    const btnTwo = page.locator('input[name="btnTwo"]');

    const originalOneValue = await btnOne.inputValue();
    const originalTwoValue = await btnTwo.inputValue();

    await page.locator('button', { hasText: 'Swap Content' }).click();

    await expect(btnOne).toHaveValue(originalTwoValue);
    await expect(btnTwo).toHaveValue(originalOneValue);
  });

  test('should swap classes when clicking Swap Class', async ({ page }) => {
    const btnOne = page.locator('input[name="btnOne"]');
    const btnTwo = page.locator('input[name="btnTwo"]');

    const originalOneClass = await btnOne.getAttribute('class');
    const originalTwoClass = await btnTwo.getAttribute('class');

    await page.locator('button', { hasText: 'Swap Class' }).click();

    await expect(btnOne).toHaveAttribute('class', originalTwoClass);
    await expect(btnTwo).toHaveAttribute('class', originalOneClass);
  });

  test('should swap IDs when clicking Swap Id', async ({ page }) => {
    const btnOne = page.locator('input[name="btnOne"]');
    const btnTwo = page.locator('input[name="btnTwo"]');

    const originalOneId = await btnOne.getAttribute('id');
    const originalTwoId = await btnTwo.getAttribute('id');

    await page.locator('button', { hasText: 'Swap Id' }).click();

    await expect(btnOne).toHaveId(originalTwoId);
    await expect(btnTwo).toHaveId(originalOneId);
  });

  test('should change positions when clicking Random Position', async ({ page }) => {
    const btnOne = page.locator('input[name="btnOne"]');

    const originalStyle = await btnOne.getAttribute('style');

    await page.locator('button', { hasText: 'Random Position' }).click();

    await expect(async () => {
      const newStyle = await btnOne.getAttribute('style');
      expect(newStyle).not.toBe(originalStyle);
    }).toPass({ timeout: 3000 });
  });

  test('should swap DOM order when clicking Swap DOM Order', async ({ page }) => {
    const container = page.locator('.animal_btns > div');
    const firstChild = container.locator('input').first();

    const originalFirstName = await firstChild.getAttribute('name');

    await page.locator('button', { hasText: 'Swap DOM Order' }).click();

    const newFirstName = await container.locator('input').first().getAttribute('name');
    expect(newFirstName).not.toBe(originalFirstName);
  });
});
