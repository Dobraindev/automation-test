import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

const S = SELECTORS.avatar;

test.describe('TC-08. 아바타 관리', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.avatar);
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-08-01 페이지 로드 - 제목과 테이블', async ({ page }) => {
    await expect(page.getByText('아바타 관리')).toBeVisible();
    await expect(page.locator(S.avatarTable)).toBeVisible();
  });

  test('TC-08-03 아바타 데이터 존재', async ({ page }) => {
    // 테이블 내 데이터 존재 확인 (헤더 제외)
    const table = page.locator(S.avatarTable);
    await expect(table).toBeVisible();
    const cells = table.locator('td');
    expect(await cells.count()).toBeGreaterThanOrEqual(1);
  });

  test('TC-08-04 새 아바타 추가 버튼', async ({ page }) => {
    await expect(page.locator(S.addButton)).toBeVisible();
  });
});
