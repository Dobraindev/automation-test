import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

const S = SELECTORS.log;

test.describe('TC-13. 로그', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.log);
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-13-01 페이지 로드 - 제목과 필터', async ({ page }) => {
    await expect(page.getByText('세션 로그').or(page.getByText('핑퐁이')).first()).toBeVisible();
  });

  test('TC-13-02 사용자 필터 드롭다운', async ({ page }) => {
    const select = page.locator('select').first();
    await expect(select).toBeVisible();
    const optionCount = await select.locator('option').count();
    expect(optionCount).toBeGreaterThanOrEqual(1);
  });

  test('TC-13-06 조회 버튼', async ({ page }) => {
    await expect(page.locator(S.searchButton)).toBeVisible();
  });

  test('TC-13-08 복사 버튼', async ({ page }) => {
    await expect(page.locator(S.copyButton)).toBeVisible();
  });
});
