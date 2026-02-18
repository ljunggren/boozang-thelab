const { test, expect } = require('@playwright/test');

test.describe('VisualBugs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/visualBugs');
  });

  test('should display the carousel with the first image', async ({ page }) => {
    const img = page.locator('.apect_ratio_inside img');
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('alt', 'zebra');

    await expect(page.locator('.label_wrapper p')).toHaveText('zebra');
  });

  test('should navigate to the next image on button click', async ({ page }) => {
    await expect(page.locator('.label_wrapper p')).toHaveText('zebra');

    await page.click('button.form_btn.add');

    const img = page.locator('.apect_ratio_inside img');
    await expect(img).toHaveAttribute('alt', 'cheetah');
    await expect(page.locator('.label_wrapper p')).toHaveText('cheetah');
  });

  test('should cycle through all images and wrap around', async ({ page }) => {
    const animals = ['zebra', 'cheetah', 'lion', 'giraffe', 'meerkat', 'elephant', 'leopard'];
    const nextBtn = page.locator('button.form_btn.add');

    for (let i = 1; i < animals.length; i++) {
      await nextBtn.click();
      await expect(page.locator('.label_wrapper p')).toHaveText(animals[i]);
    }

    await nextBtn.click();
    await expect(page.locator('.label_wrapper p')).toHaveText('zebra');
  });

  test('should display the next image button', async ({ page }) => {
    const nextBtn = page.locator('button.form_btn.add');
    await expect(nextBtn).toBeVisible();
    await expect(nextBtn).toHaveText('Next image');
  });
});
