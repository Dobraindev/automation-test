import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

const S = SELECTORS.member;

test.describe('TC-16. 권한 관리', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.member);
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-16-01 페이지 로드 - 제목과 멤버 테이블', async ({ page }) => {
    await expect(page.getByText('권한').first()).toBeVisible();
    await expect(page.locator(S.memberTable)).toBeVisible();
  });

  test('TC-16-03 역할 구분 표시', async ({ page }) => {
    // 개발자/관리자/진행자 중 하나라도 존재
    const roles = page.getByText(/개발자|관리자|진행자/);
    expect(await roles.count()).toBeGreaterThanOrEqual(1);
  });

  test('TC-16-04 새 멤버 추가 버튼', async ({ page }) => {
    await expect(page.locator(S.addMemberButton)).toBeVisible();
  });

  test('TC-16-05 멤버 데이터 존재', async ({ page }) => {
    await page.waitForTimeout(2000);
    const table = page.locator(S.memberTable);
    const tableText = await table.textContent();
    // 테이블에 실제 데이터가 있으면 텍스트가 충분히 길다
    expect(tableText?.length).toBeGreaterThan(30);
  });
});
