import { test, expect } from '@playwright/test';
import { NAV_ITEMS, ROUTES } from '../../src/config/constants.js';

const TAB_ROUTES: Record<string, string> = {
  '수업 일정': ROUTES.classMgmt,
  '진행자 근무 관리': ROUTES.schedule,
  '모니터 대시보드': ROUTES.monitorDashboard,
  '사용자': ROUTES.user,
  '활동': ROUTES.activity,
  '메시지': ROUTES.message,
  '리소스': ROUTES.resource,
  '아바타': ROUTES.avatar,
  '활동 템플릿': ROUTES.activityTemplate,
  '회기 템플릿': ROUTES.lessonTemplate,
  '커리큘럼': ROUTES.curriculum,
  '프롬프트 변수': ROUTES.promptVariable,
  '로그': ROUTES.log,
  '테스트': ROUTES.promptTest,
  '(비상용) 수업': ROUTES.emergencyClass,
  '권한 관리': ROUTES.member,
};

test.describe('TC-20. 네비게이션 (공통)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.classMgmt);
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-20-01 전체 16개 탭 표시', async ({ page }) => {
    for (const item of NAV_ITEMS) {
      await expect(page.getByRole('link', { name: item, exact: true })
        .or(page.getByText(item, { exact: true })).first())
        .toBeVisible();
    }
  });

  test('TC-20-02 관리자 이름 표시', async ({ page }) => {
    await expect(page.getByText('관리자').first()).toBeVisible();
    await expect(page.getByText('해리').first()).toBeVisible();
  });

  for (const [tabName, route] of Object.entries(TAB_ROUTES)) {
    test(`TC-20 ${tabName} 탭 이동 → ${route}`, async ({ page }) => {
      // 현재 페이지에서 시작
      await page.goto(ROUTES.classMgmt);
      await page.waitForLoadState('domcontentloaded');

      const link = page.getByRole('link', { name: tabName, exact: true })
        .or(page.locator(`a:has-text("${tabName}")`)).first();
      await link.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    });
  }
});
