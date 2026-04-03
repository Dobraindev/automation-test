import { test, expect } from '@playwright/test';
import { ROUTES } from '../../src/config/constants.js';

test.describe('EDGE-07. 반응형/뷰포트 Edge Cases', () => {
  test('EDGE-07-01 좁은 뷰포트(768px)에서 네비게이션 동작', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(ROUTES.classMgmt);
    await page.waitForLoadState('domcontentloaded');

    // 페이지가 크래시하지 않고 메인 콘텐츠 표시
    await expect(page.getByText('수업 일정 관리')).toBeVisible({ timeout: 10000 });
  });

  test('EDGE-07-02 매우 넓은 뷰포트(2560px)에서 레이아웃', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.goto(ROUTES.classMgmt);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText('수업 일정 관리')).toBeVisible();
  });

  test('EDGE-07-03 모니터 대시보드 - 작은 화면에서 카드 레이아웃', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto(ROUTES.monitorDashboard);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText('모니터 대시보드')).toBeVisible();
    await expect(page.getByText('1:1 모니터링').first()).toBeVisible();
  });
});
