import { test, expect } from '@playwright/test';

test('App renders without errors', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page.locator('#root')).toBeVisible();
});

