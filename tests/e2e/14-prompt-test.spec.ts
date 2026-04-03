import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

const S = SELECTORS.promptTest;

test.describe('TC-14. 프롬프트 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.promptTest);
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-14-01 페이지 로드 - 선택/토글/설정', async ({ page }) => {
    await expect(page.locator('select').first()).toBeVisible();
    await expect(page.locator(S.v10Button)).toBeVisible();
    await expect(page.locator(S.v15Button)).toBeVisible();
    await expect(page.locator(S.settingsButton)).toBeVisible();
  });

  test('TC-14-02 사용자 선택 드롭다운', async ({ page }) => {
    const select = page.locator('select').first();
    const optionCount = await select.locator('option').count();
    expect(optionCount).toBeGreaterThanOrEqual(1);
  });

  test('TC-14-04 V1.0/V1.5 버전 토글', async ({ page }) => {
    await expect(page.locator(S.v10Button)).toBeVisible();
    await expect(page.locator(S.v15Button)).toBeVisible();
  });

  test('TC-14-05 Settings 버튼', async ({ page }) => {
    await expect(page.locator(S.settingsButton)).toBeVisible();
  });
});
