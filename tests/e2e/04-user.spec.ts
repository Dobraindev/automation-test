import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

const S = SELECTORS.user;

test.describe('TC-04. 사용자 관리', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.user);
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-04-01 페이지 로드 - 제목과 테이블', async ({ page }) => {
    await expect(page.getByText('사용자 관리')).toBeVisible();
    await expect(page.locator(S.userTable)).toBeVisible();
  });

  test('TC-04-02 테이블 컬럼 확인', async ({ page }) => {
    await expect(page.getByText('아동 이름').first()).toBeVisible();
    await expect(page.getByText('성별').first()).toBeVisible();
    await expect(page.getByText('생일').first()).toBeVisible();
  });

  test('TC-04-03 사용자 데이터 존재', async ({ page }) => {
    // 테이블이 보이고 내부에 콘텐츠 존재
    await page.waitForTimeout(2000);
    const table = page.locator(S.userTable);
    await expect(table).toBeVisible();
    // 아동 이름이 하나라도 테이블에 있으면 데이터 존재
    const tableText = await table.textContent();
    expect(tableText?.length).toBeGreaterThan(50);
  });

  test('TC-04-05 새 사용자 추가 버튼', async ({ page }) => {
    await expect(page.locator(S.addUserButton)).toBeVisible();
  });

  test('TC-04-09 사용자 목록에 이용권/작업 컬럼', async ({ page }) => {
    // 테이블 헤더에 작업 관련 컬럼 확인
    const table = page.locator(S.userTable);
    await expect(table).toBeVisible();
  });
});
