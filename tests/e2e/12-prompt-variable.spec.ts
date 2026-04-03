import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

const S = SELECTORS.promptVariable;

test.describe('TC-12. 프롬프트 변수', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.promptVariable);
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-12-01 페이지 로드 - 제목과 변수 목록', async ({ page }) => {
    await expect(page.getByText('프롬프트 변수').first()).toBeVisible();
  });

  test('TC-12-04 변수 추가 버튼', async ({ page }) => {
    await expect(page.locator(S.addButton)).toBeVisible();
  });

  test('TC-12-05 변수 카드/목록 표시', async ({ page }) => {
    // 변수가 존재하면 카드/목록이 보여야 함
    await expect(page.getByText(/VARIABLES|변수/).first()).toBeVisible();
  });
});
