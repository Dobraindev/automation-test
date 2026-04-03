import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

test.describe('TC-10. 회기 템플릿', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.lessonTemplate);
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-10-01 페이지 로드 - 제목 표시', async ({ page }) => {
    await expect(page.getByText('회기 템플릿').first()).toBeVisible();
  });

  test('TC-10-03 회기 템플릿 수정 버튼', async ({ page }) => {
    await expect(page.locator(SELECTORS.lessonTemplate.editButton)).toBeVisible();
  });

  test('TC-10-04 새 회기 템플릿 생성 버튼', async ({ page }) => {
    await expect(page.locator(SELECTORS.lessonTemplate.createButton)).toBeVisible();
  });
});
