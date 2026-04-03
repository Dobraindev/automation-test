import { test, expect } from '@playwright/test';
import { EmergencyClassPage } from '../../../src/pages/EmergencyClassPage.js';

test.describe('(비상용) 수업 - 세션 생성', () => {
  let emergencyPage: EmergencyClassPage;

  test.beforeEach(async ({ page }) => {
    emergencyPage = new EmergencyClassPage(page);
    await emergencyPage.goto();
  });

  test('should display emergency class page @smoke', async ({ page }) => {
    await expect(page.locator('button:has-text("수업 시작")')).toBeVisible();
    await expect(page.locator('text=현재 생성된 방 목록')).toBeVisible();
  });

  test('should have child selection dropdown', async ({ page }) => {
    const selects = page.locator('select');
    expect(await selects.count()).toBeGreaterThanOrEqual(1);
  });

  test('should show "no rooms" message initially', async ({ page }) => {
    await expect(page.locator('text=생성된 방이 없습니다')).toBeVisible();
  });
});
