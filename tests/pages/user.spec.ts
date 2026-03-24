import { test, expect } from '@playwright/test';
import { UserPage } from '../../src/pages/UserPage.js';

test.describe('사용자 관리', () => {
  let userPage: UserPage;

  test.beforeEach(async ({ page }) => {
    userPage = new UserPage(page);
    await userPage.goto();
  });

  test('should display user management page @smoke', async ({ page }) => {
    await expect(page.locator('text=사용자 관리')).toBeVisible();
    await expect(page.locator('button:has-text("새 사용자 추가")')).toBeVisible();
  });

  test('should display user table with data', async () => {
    const isVisible = await userPage.isUserTableVisible();
    expect(isVisible).toBe(true);

    const count = await userPage.getUserCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should have table headers', async ({ page }) => {
    await expect(page.locator('text=아동 이름')).toBeVisible();
    await expect(page.locator('text=성별')).toBeVisible();
    await expect(page.locator('text=생일')).toBeVisible();
  });
});
