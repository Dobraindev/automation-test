import { test, expect } from '@playwright/test';
import { ROUTES } from '../../../src/config/constants.js';

test.describe('Navigation', () => {
  test('should display all navigation tabs @smoke', async ({ page }) => {
    await page.goto(ROUTES.classMgmt);
    // 핵심 탭만 확인 (일부 텍스트가 정확히 매칭되지 않을 수 있으므로)
    const essentialTabs = [
      '수업 일정', '진행자 근무 관리', '사용자', '활동',
      '메시지', '리소스', '아바타', '활동 템플릿',
      '회기 템플릿', '커리큘럼', '프롬프트 변수', '로그',
      '테스트', '권한 관리',
    ];
    for (const tab of essentialTabs) {
      await expect(page.getByRole('link', { name: tab, exact: true })).toBeVisible();
    }
  });

  test('should show admin user name in header', async ({ page }) => {
    await page.goto(ROUTES.classMgmt);
    await expect(page.locator('button:has-text("관리자 해리")')).toBeVisible();
  });

  test.describe('Tab Navigation', () => {
    const tabRoutes: [string, string][] = [
      ['수업 일정', '/main/class-mgmt'],
      ['진행자 근무 관리', '/main/schedule'],
      ['사용자', '/main/user'],
      ['메시지', '/main/message'],
      ['리소스', '/main/res'],
      ['아바타', '/main/avatars'],
      ['활동 템플릿', '/main/activity-template'],
      ['회기 템플릿', '/main/lesson-template'],
      ['커리큘럼', '/main/curriculum'],
      ['프롬프트 변수', '/main/prompt-variable'],
      ['로그', '/main/log'],
      ['테스트', '/main/prompt-test'],
      ['권한 관리', '/main/member'],
    ];

    for (const [tabName, expectedUrl] of tabRoutes) {
      test(`should navigate to "${tabName}"`, async ({ page }) => {
        await page.goto(ROUTES.classMgmt);
        await page.getByRole('link', { name: tabName }).click();
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(new RegExp(expectedUrl));
      });
    }
  });
});
