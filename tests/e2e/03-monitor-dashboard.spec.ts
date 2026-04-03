import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

test.describe('TC-03. 모니터 대시보드', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.monitorDashboard);
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-03-01 페이지 로드 - 제목 표시', async ({ page }) => {
    await expect(page.getByText('모니터 대시보드')).toBeVisible();
  });

  test('TC-03-02 실시간 세션 영역 표시', async ({ page }) => {
    await expect(page.getByText('실시간 세션').first()).toBeVisible();
  });

  test('TC-03-03 1:1 모니터링 카드 표시', async ({ page }) => {
    await expect(page.getByText('1:1 모니터링').first()).toBeVisible();
  });

  test('TC-03-04 통합 모니터링 카드 표시', async ({ page }) => {
    await expect(page.getByText('통합 모니터링').first()).toBeVisible();
  });

  test('TC-03-05 테스트 세션 영역 표시', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '테스트 세션' })).toBeVisible();
  });

  test('TC-03-06 테스트 페이지 주소 복사 버튼', async ({ page }) => {
    await expect(page.locator(SELECTORS.monitor.testPageCopyButton)).toBeVisible();
  });

  test('TC-03-08 오늘의 예정 수업 표시', async ({ page }) => {
    await expect(page.getByText('오늘의 예정 수업')).toBeVisible();
  });
});
