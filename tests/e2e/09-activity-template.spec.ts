import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

const S = SELECTORS.activityTemplate;

test.describe('TC-09. 활동 템플릿', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.activityTemplate);
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-09-01 페이지 로드 - 제목과 테이블', async ({ page }) => {
    await expect(page.getByText('템플릿').first()).toBeVisible();
    await expect(page.locator(S.templateTable)).toBeVisible();
  });

  test('TC-09-03 템플릿 데이터 존재', async ({ page }) => {
    const table = page.locator(S.templateTable);
    await expect(table).toBeVisible();
    const tableText = await table.textContent();
    expect(tableText?.length).toBeGreaterThan(20);
  });

  test('TC-09-04 새 템플릿 생성 버튼', async ({ page }) => {
    await expect(page.locator(S.createButton)).toBeVisible();
  });
});
