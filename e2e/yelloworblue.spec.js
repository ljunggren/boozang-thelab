const { test, expect } = require('@playwright/test');

test.describe('YellowOrBlue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/yellowOrBlue');
  });

  test('should display the generate color button', async ({ page }) => {
    await expect(page.locator('button.form_btn.add')).toBeVisible();
    await expect(page.locator('button.form_btn.add')).toHaveText('Generate Color');
  });

  test('should generate a color and show choice buttons', async ({ page }) => {
    await page.click('button.form_btn.add');

    const output = page.locator('[data-testid="output"]');
    await expect(output).toHaveClass(/show/);

    const colorText = await page.locator('h5.color').textContent();
    expect(['yellow', 'blue']).toContain(colorText);

    await expect(page.locator('button.form_btn.yellow')).toBeVisible();
    await expect(page.locator('button.form_btn.blue')).toBeVisible();
  });

  test('should show success when selecting the correct color', async ({ page }) => {
    await page.click('button.form_btn.add');

    const colorText = await page.locator('h5.color').textContent();

    if (colorText === 'yellow') {
      await page.click('button.form_btn.yellow');
    } else {
      await page.click('button.form_btn.blue');
    }

    const result = page.locator('[data-testid="result"]');
    await expect(result).toHaveClass(/show/);

    const message = page.locator('[data-testid="message"]');
    await expect(message).toHaveText('Success!');
    await expect(message).not.toHaveClass(/fail/);
  });

  test('should show failure when selecting the wrong color', async ({ page }) => {
    await page.click('button.form_btn.add');

    const colorText = await page.locator('h5.color').textContent();

    if (colorText === 'yellow') {
      await page.click('button.form_btn.blue');
    } else {
      await page.click('button.form_btn.yellow');
    }

    const result = page.locator('[data-testid="result"]');
    await expect(result).toHaveClass(/show/);

    const message = page.locator('[data-testid="message"]');
    await expect(message).toHaveText('Try again!');
    await expect(message).toHaveClass(/fail/);
  });
});
