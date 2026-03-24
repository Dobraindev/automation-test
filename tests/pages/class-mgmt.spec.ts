import { test, expect } from '@playwright/test';
import { ClassMgmtPage } from '../../src/pages/ClassMgmtPage.js';

test.describe('수업 일정 관리', () => {
  let classMgmt: ClassMgmtPage;

  test.beforeEach(async ({ page }) => {
    classMgmt = new ClassMgmtPage(page);
    await classMgmt.goto();
  });

  test('should display page with tabs @smoke', async ({ page }) => {
    await expect(page.locator('text=수업 일정 관리')).toBeVisible();
    await expect(page.locator('button:has-text("오늘 수업")')).toBeVisible();
    await expect(page.locator('button:has-text("전체 수업")')).toBeVisible();
    await expect(page.locator('button:has-text("중단 관리")')).toBeVisible();
  });

  test('should display add class button', async ({ page }) => {
    await expect(page.locator('button:has-text("수업 추가")')).toBeVisible();
  });

  test('should display today button and date', async ({ page }) => {
    await expect(page.getByRole('button', { name: '오늘', exact: true })).toBeVisible();
  });

  test('should have child search functionality', async ({ page }) => {
    await expect(page.locator('input[placeholder="아동 검색"]')).toBeVisible();
    await expect(page.locator('button:has-text("검색")')).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    await classMgmt.clickAllTab();
    await page.waitForTimeout(1000);
    await classMgmt.clickTodayTab();
    await page.waitForTimeout(1000);
    await classMgmt.clickStopTab();
  });
});
