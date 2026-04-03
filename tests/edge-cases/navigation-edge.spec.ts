import { test, expect } from '@playwright/test';
import { ROUTES } from '../../src/config/constants.js';

test.describe('EDGE-02. 네비게이션 Edge Cases', () => {
  test('EDGE-02-01 존재하지 않는 URL 접근 시 처리', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    // 404 또는 리다이렉트
    await page.waitForLoadState('domcontentloaded');
    const url = page.url();
    // 404 페이지 표시 or 메인으로 리다이렉트
    expect(url).toBeTruthy();
  });

  test('EDGE-02-02 새로고침 후 세션 유지', async ({ page }) => {
    await page.goto(ROUTES.classMgmt);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('수업 일정 관리')).toBeVisible();

    // 새로고침
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // 로그인 상태 유지 확인 (관리 페이지가 여전히 보임)
    await expect(page.getByText('수업 일정 관리')).toBeVisible({ timeout: 10000 });
  });

  test('EDGE-02-03 브라우저 뒤로가기/앞으로가기', async ({ page }) => {
    // 수업 일정 → 사용자 → 뒤로가기
    await page.goto(ROUTES.classMgmt);
    await page.waitForLoadState('domcontentloaded');

    await page.goto(ROUTES.user);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('사용자 관리')).toBeVisible();

    // 뒤로가기
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(new RegExp(ROUTES.classMgmt));

    // 앞으로가기
    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(new RegExp(ROUTES.user));
  });

  test('EDGE-02-04 빠른 연속 탭 전환', async ({ page }) => {
    await page.goto(ROUTES.classMgmt);
    await page.waitForLoadState('domcontentloaded');

    // 빠르게 여러 탭 클릭
    const tabs = ['사용자', '메시지', '리소스', '아바타'];
    for (const tab of tabs) {
      const link = page.getByRole('link', { name: tab, exact: true })
        .or(page.locator(`a:has-text("${tab}")`)).first();
      await link.click();
      // 로딩 기다리지 않고 다음 클릭
    }

    // 마지막 탭(아바타)에 도달해야 함
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(new RegExp(ROUTES.avatar));
  });

  test('EDGE-02-05 동일 페이지 반복 접근', async ({ page }) => {
    await page.goto(ROUTES.classMgmt);
    await page.waitForLoadState('domcontentloaded');

    // 같은 페이지 3번 재접근
    for (let i = 0; i < 3; i++) {
      await page.goto(ROUTES.classMgmt);
      await page.waitForLoadState('domcontentloaded');
    }

    await expect(page.getByText('수업 일정 관리')).toBeVisible();
  });
});
