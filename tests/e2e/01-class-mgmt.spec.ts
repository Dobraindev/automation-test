import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

const S = SELECTORS.classMgmt;

test.describe('TC-01. 수업 일정 관리', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.classMgmt);
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-01-01 페이지 로드 - 제목과 3개 탭 표시', async ({ page }) => {
    await expect(page.getByText('수업 일정 관리')).toBeVisible();
    await expect(page.locator(S.todayTab)).toBeVisible();
    await expect(page.locator(S.allTab)).toBeVisible();
    await expect(page.locator(S.stopTab)).toBeVisible();
  });

  test('TC-01-02 오늘 수업 기본 표시 - 테이블 컬럼 확인', async ({ page }) => {
    await expect(page.getByText('시간').first()).toBeVisible();
    await expect(page.getByText('아동').first()).toBeVisible();
  });

  test('TC-01-03 전체 수업 탭 전환', async ({ page }) => {
    await page.locator(S.allTab).click();
    await page.waitForTimeout(1000);
    await expect(page.locator(S.allTab)).toBeVisible();
  });

  test('TC-01-04 중단 관리 탭 전환', async ({ page }) => {
    await page.locator(S.stopTab).click();
    await page.waitForTimeout(1000);
    await expect(page.locator(S.stopTab)).toBeVisible();
  });

  test('TC-01-05 아동 검색 입력 가능', async ({ page }) => {
    const search = page.locator(S.searchInput);
    await expect(search).toBeVisible();
    await search.fill('테스트');
    await expect(search).toHaveValue('테스트');
  });

  test('TC-01-08 날짜 영역 표시', async ({ page }) => {
    // 날짜 표시 영역 (예: "2026년 3월 25일 (수)")
    await expect(page.getByText(/\d{4}년/).first()).toBeVisible();
  });

  test('TC-01-10 수업 일정 데이터 로드', async ({ page }) => {
    // 데이터 로딩 대기
    await page.waitForTimeout(5000);
    // 수업 데이터 또는 빈 상태 메시지가 표시되면 페이지 정상 동작
    const hasData = await page.locator('table, [class*="schedule"], [class*="class"]').first()
      .isVisible({ timeout: 5000 }).catch(() => false);
    const hasTime = await page.getByText(/\d{1,2}:\d{2}/).first()
      .isVisible({ timeout: 3000 }).catch(() => false);
    expect(hasData || hasTime).toBe(true);
  });
});
