import { test, expect } from '@playwright/test';
import { ROUTES } from '../../../src/config/constants.js';

test.describe('진행자 근무 관리', () => {
  test('should display schedule page @smoke', async ({ page }) => {
    await page.goto(ROUTES.schedule);
    await expect(page.getByRole('heading', { name: /진행자.*관리/ })).toBeVisible();
    await expect(page.getByRole('button', { name: '고정 시간표 관리' })).toBeVisible();
  });
});

test.describe('모니터 대시보드', () => {
  test('should display monitor dashboard @smoke', async ({ page }) => {
    await page.goto(ROUTES.monitorDashboard);
    await expect(page.getByRole('heading', { name: '모니터 대시보드' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /실시간 세션/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /테스트 세션/ })).toBeVisible();
  });

  test('should show test page copy button', async ({ page }) => {
    await page.goto(ROUTES.monitorDashboard);
    await expect(page.locator('button:has-text("테스트 페이지 주소 복사")')).toBeVisible();
  });
});

test.describe('활동 목록', () => {
  test('should display activity page @smoke', async ({ page }) => {
    await page.goto(ROUTES.activity);
    await expect(page.getByRole('heading', { name: '활동 목록' })).toBeVisible();
    await expect(page.locator('button:has-text("새 활동 생성")')).toBeVisible();
  });
});

test.describe('메시지', () => {
  test('should display message page @smoke', async ({ page }) => {
    await page.goto(ROUTES.message);
    await expect(page.locator('input[placeholder*="메시지를 입력"]')).toBeVisible();
    await expect(page.locator('button:has-text("생성")')).toBeVisible();
  });

  test('should display alert rules section', async ({ page }) => {
    await page.goto(ROUTES.message);
    await expect(page.getByRole('heading', { name: '진행자 알림 메시지' })).toBeVisible();
  });
});

test.describe('리소스', () => {
  test('should display resource page @smoke', async ({ page }) => {
    await page.goto(ROUTES.resource);
    await expect(page.getByRole('heading', { name: '리소스 업로드' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '리소스 목록' })).toBeVisible();
  });

  test('should show file search input', async ({ page }) => {
    await page.goto(ROUTES.resource);
    await expect(page.locator('input[placeholder*="파일명 검색"]')).toBeVisible();
  });
});

test.describe('아바타 관리', () => {
  test('should display avatar page @smoke', async ({ page }) => {
    await page.goto(ROUTES.avatar);
    await expect(page.getByRole('heading', { name: '아바타 관리' })).toBeVisible();
    await expect(page.locator('button:has-text("새 아바타 추가")')).toBeVisible();
  });

  test('should display avatar table', async ({ page }) => {
    await page.goto(ROUTES.avatar);
    await page.waitForLoadState('networkidle');
    const rows = page.locator('table tr').filter({ hasNotText: /^ID/ });
    expect(await rows.count()).toBeGreaterThan(0);
  });
});

test.describe('활동 템플릿', () => {
  test('should display template page @smoke', async ({ page }) => {
    await page.goto(ROUTES.activityTemplate);
    await expect(page.getByRole('heading', { name: '템플릿 목록' })).toBeVisible();
    await expect(page.locator('button:has-text("새 템플릿 생성")')).toBeVisible();
  });
});

test.describe('회기 템플릿', () => {
  test('should display lesson template page @smoke', async ({ page }) => {
    await page.goto(ROUTES.lessonTemplate);
    await expect(page.getByRole('heading', { name: '회기 템플릿 관리' })).toBeVisible();
    await expect(page.locator('button:has-text("새 회기 템플릿 생성")')).toBeVisible();
  });
});

test.describe('커리큘럼/학습플랜', () => {
  test('should display curriculum page @smoke', async ({ page }) => {
    await page.goto(ROUTES.curriculum);
    // dev: 학습플랜 관리, staging: 커리큘럼 관리
    const heading = page.getByRole('heading', { name: '커리큘럼 관리' })
      .or(page.getByRole('heading', { name: '학습플랜 관리' }));
    await expect(heading.first()).toBeVisible();
    const createBtn = page.locator('button:has-text("새 커리큘럼")')
      .or(page.locator('button:has-text("새 학습플랜")'));
    await expect(createBtn.first()).toBeVisible();
  });
});

test.describe('프롬프트 변수', () => {
  test('should display prompt variable page @smoke', async ({ page }) => {
    await page.goto(ROUTES.promptVariable);
    await expect(page.getByRole('heading', { name: '프롬프트 변수 관리' })).toBeVisible();
    await expect(page.locator('button:has-text("변수 추가")')).toBeVisible();
  });
});

test.describe('로그', () => {
  test('should display log page @smoke', async ({ page }) => {
    await page.goto(ROUTES.log);
    await expect(page.getByRole('heading', { name: '핑퐁이 세션 로그' })).toBeVisible();
    await expect(page.locator('button:has-text("조회")')).toBeVisible();
  });
});

test.describe('테스트', () => {
  test('should display prompt test page @smoke', async ({ page }) => {
    await page.goto(ROUTES.promptTest);
    await expect(page.locator('button:has-text("V1.0")')).toBeVisible();
    await expect(page.locator('button:has-text("V1.5")')).toBeVisible();
  });
});

test.describe('권한 관리', () => {
  test('should display member page @smoke', async ({ page }) => {
    await page.goto(ROUTES.member);
    await expect(page.getByRole('heading', { name: '권한 관리' })).toBeVisible();
    await expect(page.locator('button:has-text("새 멤버 추가")')).toBeVisible();
  });

  test('should display member table with roles', async ({ page }) => {
    await page.goto(ROUTES.member);
    await page.waitForLoadState('networkidle');
    const rows = page.locator('table tr').filter({ hasNotText: /^이름/ });
    expect(await rows.count()).toBeGreaterThan(0);
  });
});
