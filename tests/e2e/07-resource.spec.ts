import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

const S = SELECTORS.resource;

test.describe('TC-07. 리소스 관리', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.resource);
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-07-01 페이지 로드 - 업로드/목록 영역', async ({ page }) => {
    await expect(page.getByText('리소스').first()).toBeVisible();
  });

  test('TC-07-02 업로드 영역 표시', async ({ page }) => {
    await expect(page.locator(S.uploadArea)).toBeVisible();
  });

  test('TC-07-03 파일명 검색 입력', async ({ page }) => {
    const search = page.locator(S.searchInput);
    await expect(search).toBeVisible();
    await search.fill('test');
    await expect(search).toHaveValue('test');
  });

  test('TC-07-04 리소스 테이블 표시', async ({ page }) => {
    await expect(page.locator(S.resourceTable)).toBeVisible();
  });

  test('TC-07-05 리소스 총 개수 표시', async ({ page }) => {
    await expect(page.getByText(/총 \d+개/)).toBeVisible();
  });
});
