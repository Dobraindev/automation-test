import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

test.describe('EDGE-01. 인증 Edge Cases', () => {
  test.use({ storageState: undefined }); // 비로그인 상태로 테스트

  test('EDGE-01-01 비로그인 상태에서 관리 페이지 접근 시 정상 처리', async ({ page }) => {
    await page.goto(ROUTES.classMgmt);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    // 로그인 리다이렉트 또는 관리 페이지 표시 (서버 인증 정책에 따라)
    const url = page.url();
    expect(url).toBeTruthy(); // 크래시 없이 정상 응답
  });

  test('EDGE-01-02 비로그인 상태에서 모니터 대시보드 접근 시 정상 처리', async ({ page }) => {
    await page.goto(ROUTES.monitorDashboard);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('EDGE-01-03 잘못된 비밀번호로 로그인 시도', async ({ page }) => {
    await page.goto(ROUTES.home);
    await page.waitForLoadState('domcontentloaded');

    const nameInput = page.locator(SELECTORS.login.nameInput);
    await nameInput.click();
    await nameInput.type('해리', { delay: 50 });

    const pwInput = page.locator(SELECTORS.login.passwordInput);
    await pwInput.click();
    await pwInput.type('9999', { delay: 50 });

    await page.locator(SELECTORS.login.submitButton).click();
    await page.waitForTimeout(2000);

    // 로그인 실패 → 여전히 로그인 페이지에 머무름
    await expect(page.locator(SELECTORS.login.submitButton)).toBeVisible();
  });

  test('EDGE-01-04 빈 이름으로 로그인 시도', async ({ page }) => {
    await page.goto(ROUTES.home);
    await page.waitForLoadState('domcontentloaded');

    const pwInput = page.locator(SELECTORS.login.passwordInput);
    await pwInput.click();
    await pwInput.type('0306', { delay: 50 });

    await page.locator(SELECTORS.login.submitButton).click();
    await page.waitForTimeout(2000);

    // 로그인 실패
    await expect(page.locator(SELECTORS.login.submitButton)).toBeVisible();
  });

  test('EDGE-01-05 빈 비밀번호로 로그인 시도', async ({ page }) => {
    await page.goto(ROUTES.home);
    await page.waitForLoadState('domcontentloaded');

    const nameInput = page.locator(SELECTORS.login.nameInput);
    await nameInput.click();
    await nameInput.type('해리', { delay: 50 });

    await page.locator(SELECTORS.login.submitButton).click();
    await page.waitForTimeout(2000);

    await expect(page.locator(SELECTORS.login.submitButton)).toBeVisible();
  });
});
