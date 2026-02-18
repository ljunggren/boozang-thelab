const { test, expect } = require('@playwright/test');

test.describe('Table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tables');
  });

  test('should display the table with animal data', async ({ page }) => {
    const table = page.locator('#animalTable');
    await expect(table).toBeVisible();

    const headers = table.locator('thead th');
    await expect(headers.nth(1)).toHaveText('Name');
    await expect(headers.nth(2)).toHaveText('Species');
    await expect(headers.nth(3)).toHaveText('Hairdo');

    const visibleRows = table.locator('tbody tr').filter({ has: page.locator('td') });
    const count = await visibleRows.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should navigate to the next page and back', async ({ page }) => {
    const table = page.locator('#animalTable');
    await expect(table).toBeVisible();

    const firstPageRows = table.locator('tbody tr').filter({ has: page.locator('td') });
    const firstPageNames = [];
    for (let i = 0; i < await firstPageRows.count(); i++) {
      const name = await firstPageRows.nth(i).locator('td').nth(1).textContent();
      firstPageNames.push(name);
    }

    const nextBtn = page.locator('button', { hasText: 'Next' });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    const secondPageRows = table.locator('tbody tr').filter({ has: page.locator('td') });
    await expect(secondPageRows.first()).toBeVisible();
    const secondPageFirstName = await secondPageRows.first().locator('td').nth(1).textContent();
    expect(firstPageNames).not.toContain(secondPageFirstName);

    const prevBtn = page.locator('button', { hasText: 'Previous' });
    await expect(prevBtn).toBeVisible();
    await prevBtn.click();

    const backRows = table.locator('tbody tr').filter({ has: page.locator('td') });
    const backFirstName = await backRows.first().locator('td').nth(1).textContent();
    expect(backFirstName).toBe(firstPageNames[0]);
  });

  test('should filter table rows by species checkbox', async ({ page }) => {
    const table = page.locator('#animalTable');
    await expect(table).toBeVisible();

    const lionCheckbox = page.locator('input[name="lion"]');
    const elephantCheckbox = page.locator('input[name="elephant"]');

    await lionCheckbox.uncheck();
    await elephantCheckbox.uncheck();

    const visibleRows = table.locator('tbody tr').filter({ has: page.locator('td') });
    for (let i = 0; i < await visibleRows.count(); i++) {
      const species = await visibleRows.nth(i).locator('td').nth(2).textContent();
      expect(species).toBe('zebra');
    }

    await lionCheckbox.check();

    const updatedRows = table.locator('tbody tr').filter({ has: page.locator('td') });
    const species = [];
    for (let i = 0; i < await updatedRows.count(); i++) {
      species.push(await updatedRows.nth(i).locator('td').nth(2).textContent());
    }
    expect(species).toContain('lion');
    expect(species).not.toContain('elephant');
  });

  test('should like an animal', async ({ page }) => {
    const table = page.locator('#animalTable');
    await expect(table).toBeVisible();

    const firstRow = table.locator('tbody tr').filter({ has: page.locator('td') }).first();
    const heartIcon = firstRow.locator('i.liked_icon');
    const isAlreadyLiked = await heartIcon.evaluate(el => el.classList.contains('liked'));

    if (isAlreadyLiked) {
      await heartIcon.click();
      await expect(heartIcon).not.toHaveClass(/\bliked\b/);
    }

    await heartIcon.click();
    await expect(heartIcon).toHaveClass(/\bliked\b/);
  });

  test('should unlike a liked animal', async ({ page }) => {
    const table = page.locator('#animalTable');
    await expect(table).toBeVisible();

    const firstRow = table.locator('tbody tr').filter({ has: page.locator('td') }).first();
    const heartIcon = firstRow.locator('i.liked_icon');
    const isAlreadyLiked = await heartIcon.evaluate(el => el.classList.contains('liked'));

    if (!isAlreadyLiked) {
      await heartIcon.click();
      await expect(heartIcon).toHaveClass(/\bliked\b/);
    }

    await heartIcon.click();
    await expect(heartIcon).not.toHaveClass(/\bliked\b/);
  });
});
