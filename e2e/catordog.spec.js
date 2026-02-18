const { test, expect } = require('@playwright/test');

test.describe('CatOrDog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catOrDog');
  });

  test('should display the generate image button', async ({ page }) => {
    await expect(page.locator('button.form_btn.add')).toBeVisible();
    await expect(page.locator('button.form_btn.add')).toHaveText('Generate Image');
  });

  test('should generate an image and show choice buttons', async ({ page }) => {
    await page.click('button.form_btn.add');

    const output = page.locator('[data-testid="output"]');
    await expect(output).toHaveClass(/show/);

    const img = page.locator('[data-testid="output"] .image img');
    await expect(img).toBeVisible();

    const alt = await img.getAttribute('alt');
    expect(['cat', 'dog']).toContain(alt);

    await expect(page.locator('button.form_btn.pink_dark')).toBeVisible();
    await expect(page.locator('button.form_btn.turqoise')).toBeVisible();
  });

  test('should show success when selecting the correct answer', async ({ page }) => {
    await page.click('button.form_btn.add');

    const img = page.locator('[data-testid="output"] .image img');
    await expect(img).toBeVisible();
    const alt = await img.getAttribute('alt');

    if (alt === 'cat') {
      await page.click('button.form_btn.pink_dark');
    } else {
      await page.click('button.form_btn.turqoise');
    }

    const result = page.locator('[data-testid="result"]');
    await expect(result).toHaveClass(/show/);

    const message = page.locator('[data-testid="message"]');
    await expect(message).toHaveText('Success!');
    await expect(message).not.toHaveClass(/fail/);
  });

  test('should show failure when selecting the wrong answer', async ({ page }) => {
    await page.click('button.form_btn.add');

    const img = page.locator('[data-testid="output"] .image img');
    await expect(img).toBeVisible();
    const alt = await img.getAttribute('alt');

    if (alt === 'cat') {
      await page.click('button.form_btn.turqoise');
    } else {
      await page.click('button.form_btn.pink_dark');
    }

    const result = page.locator('[data-testid="result"]');
    await expect(result).toHaveClass(/show/);

    const message = page.locator('[data-testid="message"]');
    await expect(message).toHaveText('Try again!');
    await expect(message).toHaveClass(/fail/);
  });
});
