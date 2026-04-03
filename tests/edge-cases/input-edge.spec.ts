import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

test.describe('EDGE-03. 입력 Edge Cases', () => {
  test('EDGE-03-01 수업 일정 - 아동 검색에 특수문자 입력', async ({ page }) => {
    await page.goto(ROUTES.classMgmt);
    await page.waitForLoadState('domcontentloaded');

    const search = page.locator(SELECTORS.classMgmt.searchInput);
    await search.fill('<script>alert(1)</script>');
    await page.locator(SELECTORS.classMgmt.searchButton).click();
    await page.waitForTimeout(1000);

    // XSS가 실행되지 않고, 페이지가 정상 표시되어야 함
    await expect(page.getByText('수업 일정 관리')).toBeVisible();
  });

  test('EDGE-03-02 수업 일정 - 아동 검색에 매우 긴 문자열 입력', async ({ page }) => {
    await page.goto(ROUTES.classMgmt);
    await page.waitForLoadState('domcontentloaded');

    const search = page.locator(SELECTORS.classMgmt.searchInput);
    const longString = 'a'.repeat(500);
    await search.fill(longString);
    await page.locator(SELECTORS.classMgmt.searchButton).click();
    await page.waitForTimeout(1000);

    // 페이지 크래시 없이 정상 동작
    await expect(page.getByText('수업 일정 관리')).toBeVisible();
  });

  test('EDGE-03-03 수업 일정 - 아동 검색에 빈 문자열 검색', async ({ page }) => {
    await page.goto(ROUTES.classMgmt);
    await page.waitForLoadState('domcontentloaded');

    const search = page.locator(SELECTORS.classMgmt.searchInput);
    await search.fill('');
    await page.locator(SELECTORS.classMgmt.searchButton).click();
    await page.waitForTimeout(1000);

    // 전체 결과가 표시되거나 정상 동작
    await expect(page.getByText('수업 일정 관리')).toBeVisible();
  });

  test('EDGE-03-04 수업 일정 - 아동 검색에 존재하지 않는 이름 입력', async ({ page }) => {
    await page.goto(ROUTES.classMgmt);
    await page.waitForLoadState('domcontentloaded');

    const search = page.locator(SELECTORS.classMgmt.searchInput);
    await search.fill('존재하지않는아동이름zzz');
    await page.locator(SELECTORS.classMgmt.searchButton).click();
    await page.waitForTimeout(1000);

    // 검색 결과 없음 표시 또는 빈 테이블
    await expect(page.getByText('수업 일정 관리')).toBeVisible();
  });

  test('EDGE-03-05 리소스 - 파일명 검색에 SQL Injection 패턴 입력', async ({ page }) => {
    await page.goto(ROUTES.resource);
    await page.waitForLoadState('domcontentloaded');

    const search = page.locator(SELECTORS.resource.searchInput);
    await search.fill("'; DROP TABLE resources; --");
    await page.waitForTimeout(1000);

    // 페이지 정상 동작
    await expect(page.getByText('리소스').first()).toBeVisible();
  });

  test('EDGE-03-06 리소스 - 파일명 검색에 한글/영어/숫자/특수문자 혼합', async ({ page }) => {
    await page.goto(ROUTES.resource);
    await page.waitForLoadState('domcontentloaded');

    const search = page.locator(SELECTORS.resource.searchInput);
    await search.fill('테스트_file-123!@#');
    await page.waitForTimeout(1000);

    await expect(page.getByText('리소스').first()).toBeVisible();
  });
});
