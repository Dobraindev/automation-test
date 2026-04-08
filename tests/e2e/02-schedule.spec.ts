import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

const S = SELECTORS.schedule;

test.describe('TC-02. 진행자 근무 관리', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.schedule);
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-02-01 페이지 로드 - 제목과 2개 탭', async ({ page }) => {
    await expect(page.getByText('진행자 근무 관리').or(page.getByText('진행자 일정 관리')).first()).toBeVisible();
    await expect(page.locator(S.fixedTab)).toBeVisible();
    await expect(page.locator(S.tempTab)).toBeVisible();
  });

  test('TC-02-02 고정 시간표 표시', async ({ page }) => {
    // 요일 헤더 확인
    await expect(page.getByText('월').first()).toBeVisible();
    await expect(page.getByText('화').first()).toBeVisible();
    await expect(page.getByText('수').first()).toBeVisible();
  });

  test('TC-02-03 진행자 선택 또는 날짜 필터', async ({ page }) => {
    // dev: 고정 시간표에 진행자 select 표시 / staging: 시작일/종료일 표시
    const hasSelect = await page.locator('select').first().isVisible({ timeout: 5000 }).catch(() => false);
    const hasDateFilter = await page.getByText('시작일').first().isVisible({ timeout: 3000 }).catch(() => false);
    const hasScheduleTable = await page.getByText('TIME').or(page.getByText('월요일')).first().isVisible({ timeout: 3000 }).catch(() => false);
    expect(hasSelect || hasDateFilter || hasScheduleTable).toBe(true);
  });

  test('TC-02-05 임시 휴무 관리 탭 전환', async ({ page }) => {
    await page.locator(S.tempTab).click();
    await page.waitForTimeout(1000);
    await expect(page.locator(S.tempTab)).toBeVisible();
  });
});
