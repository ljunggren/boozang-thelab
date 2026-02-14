const { test, expect } = require('@playwright/test');

test.describe('ConcatStrings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/concatStrings');
  });

  test('should display the generate strings button', async ({ page }) => {
    const generateBtn = page.getByRole('button', { name: 'Generate strings' });
    await expect(generateBtn).toBeVisible();
    await expect(generateBtn).toHaveText('Generate strings');
  });

  test('should generate two random strings', async ({ page }) => {
    await page.click('button.form_btn.add');

    const output = page.locator('[data-testid="output"]');
    await expect(output).toHaveClass(/show/);

    const string1 = await page.locator('p.string1').textContent();
    const string2 = await page.locator('p.string2').textContent();

    expect(string1.length).toBeGreaterThan(0);
    expect(string2.length).toBeGreaterThan(0);
  });

  test('should show success when submitting the correct concatenation', async ({ page }) => {
    await page.getByRole('button', { name: 'Generate strings' }).click();

    const string1 = await page.locator('p.string1').textContent();
    const string2 = await page.locator('p.string2').textContent();
    const concatenated = string1 + string2;

    await page.fill('input[name="strings"]', concatenated);
    await page.getByRole('button', { name: 'Submit string' }).click();

    const result = page.locator('[data-testid="result"]');
    await expect(result).toHaveClass(/show/);

    const message = page.locator('[data-testid="message"]');
    await expect(message).toHaveText('Success!');
  });

  test('should show failure when submitting incorrect concatenation', async ({ page }) => {
    await page.getByRole('button', { name: 'Generate strings' }).click();

    await page.fill('input[name="strings"]', 'wronganswer');
    await page.getByRole('button', { name: 'Submit string' }).click();

    const result = page.locator('[data-testid="result"]');
    await expect(result).toHaveClass(/show/);

    const message = page.locator('[data-testid="message"]');
    await expect(message).toHaveText('Try again!');
    await expect(message).toHaveClass(/fail/);
  });
});
