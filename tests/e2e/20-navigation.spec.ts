import { test, expect } from '@playwright/test';
import { NAV_ITEMS, ROUTES } from '../../src/config/constants.js';

// 일부 release에서 명칭이 다를 수 있는 탭은 [primary, alt] 배열로 정의
type TabSpec = [string, string] | [string, string, string]; // [primary, route, alt?]
const TAB_ROUTES: TabSpec[] = [
  ['수업 일정', ROUTES.classMgmt],
  ['진행자 근무 관리', ROUTES.schedule],
  ['모니터 대시보드', ROUTES.monitorDashboard],
  ['사용자', ROUTES.user],
  ['활동', ROUTES.activity],
  ['메시지', ROUTES.message],
  ['리소스', ROUTES.resource],
  ['아바타', ROUTES.avatar],
  ['활동 템플릿', ROUTES.activityTemplate],
  ['회기 템플릿', ROUTES.lessonTemplate],
  ['커리큘럼', ROUTES.curriculum, '학습플랜'],
  ['프롬프트 변수', ROUTES.promptVariable],
  ['로그', ROUTES.log],
  ['테스트', ROUTES.promptTest],
  ['(비상용) 수업', ROUTES.emergencyClass],
  ['권한 관리', ROUTES.member],
];

test.describe('TC-20. 네비게이션 (공통)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.classMgmt);
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-20-01 네비게이션 탭 표시', async ({ page }) => {
    // 페이지 상단 링크들 확인 (a 태그 전체)
    const allLinks = page.locator('a[href*="/main"], a[href*="/monitor"]');
    const count = await allLinks.count();
    expect(count).toBeGreaterThanOrEqual(8);
  });

  test('TC-20-02 관리자 이름 표시', async ({ page }) => {
    // 1.64.0+: "관리자" → "개발자" 라벨 변경 가능성
    const role = page.getByText('관리자').first().or(page.getByText('개발자').first());
    await expect(role).toBeVisible();
    await expect(page.getByText('해리').first()).toBeVisible();
  });

  for (const tabSpec of TAB_ROUTES) {
    const [tabName, route, altName] = tabSpec;
    test(`TC-20 ${tabName} 탭 이동 → ${route}`, async ({ page }) => {
      await page.goto(ROUTES.classMgmt);
      await page.waitForLoadState('domcontentloaded');

      // primary 명칭 → 없으면 alt 명칭으로 fallback
      const primary = page.getByRole('link', { name: tabName, exact: true });
      const alt = altName ? page.getByRole('link', { name: altName, exact: true }) : null;
      const link = alt ? primary.or(alt).first() : primary;

      await link.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    });
  }
});
