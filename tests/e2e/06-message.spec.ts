import { test, expect } from '@playwright/test';
import { ROUTES, SELECTORS } from '../../src/config/constants.js';

const S = SELECTORS.messagePage;

test.describe('TC-06. 메시지 관리', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.message);
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-06-01 페이지 로드 - 메시지 입력창과 생성 버튼', async ({ page }) => {
    await expect(page.locator(S.messageInput)).toBeVisible();
    await expect(page.locator(S.createButton)).toBeVisible();
  });

  test('TC-06-03 메시지 목록 테이블', async ({ page }) => {
    await expect(page.getByText('메시지').first()).toBeVisible();
    await expect(page.getByText('생성일').first()).toBeVisible();
  });

  test('TC-06-06 진행자 알림 메시지 섹션', async ({ page }) => {
    await expect(page.getByText('진행자 알림 메시지').first()).toBeVisible();
  });

  test('TC-06-07 알림 규칙 추가 버튼', async ({ page }) => {
    await expect(page.locator(S.addRuleButton)).toBeVisible();
  });

  test('TC-06-09 알림톡 메시지 템플릿 섹션', async ({ page }) => {
    await expect(page.getByText('알림톡').first()).toBeVisible();
  });

  test('TC-06-10 템플릿 추가 버튼', async ({ page }) => {
    await expect(page.locator(S.addTemplateButton)).toBeVisible();
  });
});
