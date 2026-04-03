import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

const S = SELECTORS.emergencyClass;

test.describe('TC-15. (비상용) 수업', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.emergencyClass);
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-15-01 페이지 로드 - 드롭다운과 수업 시작 버튼', async ({ page }) => {
    await expect(page.locator(S.startButton)).toBeVisible();
    await expect(page.locator(S.roomList)).toBeVisible();
  });

  test('TC-15-02 아동 선택 드롭다운', async ({ page }) => {
    const select = page.locator('select').first();
    await expect(select).toBeVisible();
    const optionCount = await select.locator('option').count();
    expect(optionCount).toBeGreaterThanOrEqual(1);
  });

  test('TC-15-05 방 목록 영역 표시', async ({ page }) => {
    await expect(page.locator(S.roomList)).toBeVisible();
  });

  test('TC-15-06 방 미생성 안내', async ({ page }) => {
    await expect(page.getByText('생성된 방이 없습니다')).toBeVisible();
  });
});
