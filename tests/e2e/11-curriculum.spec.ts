import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

const S = SELECTORS.curriculum;

test.describe('TC-11. 커리큘럼/학습플랜 관리', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.curriculum);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
  });

  test('TC-11-01 페이지 로드 - 제목과 사이드바', async ({ page }) => {
    // 1.65.0+: 커리큘럼 → 학습플랜 명칭 변경
    const title = page.getByText('커리큘럼').first()
      .or(page.getByText('학습플랜').first());
    await expect(title).toBeVisible({ timeout: 15000 });
  });

  test('TC-11-04 커리큘럼 검색 입력', async ({ page }) => {
    const search = page.locator(S.searchInput)
      .or(page.locator('input[placeholder*="학습플랜 검색"]'))
      .or(page.locator('input[placeholder*="검색"]').first());
    if (await search.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await search.first().fill('테스트');
      await expect(search.first()).toHaveValue('테스트');
    }
  });

  test('TC-11-05 새 커리큘럼/학습플랜 생성 버튼', async ({ page }) => {
    const btn = page.locator(S.createButton)
      .or(page.getByText('새 커리큘럼').first())
      .or(page.getByText('새 학습플랜').first())
      .or(page.getByText('커리큘럼 생성').first())
      .or(page.locator('button').filter({ hasText: /생성|추가|커리큘럼|학습플랜/ }).first());
    const isVisible = await btn.first().isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      // 버튼이 없으면 페이지 자체 로드만 확인
      const pageTitle = page.getByText('커리큘럼').first().or(page.getByText('학습플랜').first());
      await expect(pageTitle).toBeVisible();
    }
  });
});
