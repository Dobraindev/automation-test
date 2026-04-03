import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

const S = SELECTORS.activityPage;

test.describe('TC-05. 활동 관리', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.activity);
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-05-01 페이지 로드 - 제목과 버튼', async ({ page }) => {
    await expect(page.getByText('활동').first()).toBeVisible();
    await expect(page.locator(S.newSessionButton)).toBeVisible();
    await expect(page.locator(S.editSessionButton)).toBeVisible();
    await expect(page.locator(S.newActivityButton)).toBeVisible();
  });

  test('TC-05-02 사용자 선택 드롭다운', async ({ page }) => {
    const select = page.locator(S.userSelect).first();
    await expect(select).toBeVisible();
    const optionCount = await select.locator('option').count();
    expect(optionCount).toBeGreaterThanOrEqual(1);
  });

  test('TC-05-05 새 회기 생성 버튼', async ({ page }) => {
    await expect(page.locator(S.newSessionButton)).toBeVisible();
    await expect(page.locator(S.newSessionButton)).toBeEnabled();
  });

  test('TC-05-07 새 활동 생성 버튼', async ({ page }) => {
    await expect(page.locator(S.newActivityButton)).toBeVisible();
  });
});
