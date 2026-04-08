import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { ROUTES, SELECTORS, TIMEOUTS } from '../../src/config/constants.js';

/**
 * TC-17. 세션 E2E - 게스트/호스트 진입 플로우 (멀티탭)
 *
 * 호스트(관리자 로그인) + 게스트(비로그인) 2개 독립 컨텍스트
 */

const GUEST_NAME = '해리';
const GUEST_PHONE = '4120';
const LESSON_INDEX = '17';

test.describe('TC-17. 세션 E2E - 게스트/호스트 진입', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(120000);

  let hostContext: BrowserContext;
  let guestContext: BrowserContext;
  let hostPage: Page;
  let guestPage: Page;

  test.beforeAll(async ({ browser }) => {
    hostContext = await browser.newContext({
      storageState: 'auth/user.json',
      permissions: ['microphone', 'camera'],
    });
    guestContext = await browser.newContext({
      permissions: ['microphone', 'camera'],
    });
    hostPage = await hostContext.newPage();
    guestPage = await guestContext.newPage();
  });

  test.afterAll(async () => {
    await hostContext?.close();
    await guestContext?.close();
  });

  // ── 게스트 진입 ──

  test('TC-17-01 테스트 페이지 URL 획득', async () => {
    await hostPage.goto(ROUTES.monitorDashboard);
    await expect(hostPage.locator(SELECTORS.monitor.testPageCopyButton)).toBeVisible({ timeout: TIMEOUTS.medium });
  });

  test('TC-17-02 게스트 로그인 폼 - 3개 입력 필드', async () => {
    await guestPage.goto(ROUTES.guestTest);
    await expect(guestPage.locator('input[placeholder*="이름"]')).toBeVisible({ timeout: TIMEOUTS.medium });
    await expect(guestPage.locator('input[placeholder*="전화번호"]')).toBeVisible();
    await expect(guestPage.locator('input[placeholder*="인덱스"]')).toBeVisible();
    await expect(guestPage.locator(SELECTORS.guest.enterButton)).toBeVisible();
  });

  test('TC-17-03 게스트 정보 입력 후 입장하기 활성화', async () => {
    await guestPage.locator('input[placeholder*="이름"]').click();
    await guestPage.locator('input[placeholder*="이름"]').type(GUEST_NAME, { delay: 100 });
    await guestPage.locator('input[placeholder*="전화번호"]').fill(GUEST_PHONE);
    await guestPage.locator('input[placeholder*="인덱스"]').fill(LESSON_INDEX);
    await guestPage.waitForTimeout(3000);
    await expect(guestPage.locator(SELECTORS.guest.enterButton)).toBeEnabled({ timeout: 15000 });
  });

  test('TC-17-04 게스트 입장 - 처음부터/이어하기 처리', async () => {
    await guestPage.locator(SELECTORS.guest.enterButton).click();

    const fromStart = guestPage.locator(SELECTORS.guest.fromStartButton);
    const loading = guestPage.locator('text=친구가 만날 준비를 하고 있어요');
    const ready = guestPage.locator('text=준비됐나요');

    await expect(fromStart.or(loading).or(ready).first()).toBeVisible({ timeout: TIMEOUTS.long });

    if (await fromStart.isVisible({ timeout: 3000 }).catch(() => false)) {
      await fromStart.click();
    }
  });

  test('TC-17-05 리소스 로딩 완료', async () => {
    await expect(guestPage.locator('text=준비됐나요')).toBeVisible({ timeout: 60000 });
  });

  test('TC-17-06 게스트 시작 - 세션 화면 진입', async () => {
    await guestPage.getByRole('button', { name: '시작' }).click();
    await guestPage.waitForTimeout(5000);
  });

  test('TC-17-07 게스트 카메라 피드 표시', async () => {
    await expect(guestPage.locator('video').first()).toBeVisible({ timeout: TIMEOUTS.medium });
  });

  // ── 호스트 진입 ──

  test('TC-17-08 모니터 대시보드에 해리_17회기 표시', async () => {
    await hostPage.goto(ROUTES.monitorDashboard);
    await expect(hostPage.locator('text=해리_17회기')).toBeVisible({ timeout: TIMEOUTS.medium });
  });

  test('TC-17-09 호스트 해리_17회기 클릭 진입', async () => {
    await hostPage.locator('text=해리_17회기').click();
    await hostPage.waitForLoadState('domcontentloaded');
  });

  test('TC-17-10 호스트 시작 다이얼로그', async () => {
    // "시작" 또는 "Start" 버튼 대기 (dev/staging 차이 허용)
    const startBtn = hostPage.getByRole('button', { name: '시작' })
      .or(hostPage.getByRole('button', { name: 'Start' }))
      .or(hostPage.locator('button:has-text("시작")'));
    // 시작 다이얼로그가 없을 수 있음 (이미 세션 활성)
    const isVisible = await startBtn.first().isVisible({ timeout: TIMEOUTS.long }).catch(() => false);
    if (isVisible) {
      await startBtn.first().click();
    }
    await hostPage.waitForTimeout(5000);
  });

  // ── 호스트 UI 검증 ──

  test('TC-17-11 호스트 페이지 활성 확인', async () => {
    // 호스트 페이지가 세션 활성 상태인지 확인 (다양한 UI 요소)
    await hostPage.waitForTimeout(3000);
    const indicators = [
      hostPage.locator('text=ACTIVITY'),
      hostPage.locator('text=Next'),
      hostPage.getByText('자동 전환'),
      hostPage.getByText('수업 종료'),
      hostPage.getByText('대시보드'),
      hostPage.getByPlaceholder('메시지 입력'),
    ];
    let found = false;
    for (const loc of indicators) {
      if (await loc.first().isVisible({ timeout: 2000 }).catch(() => false)) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });

  test('TC-17-12 호스트 Next 버튼 표시', async () => {
    await expect(hostPage.locator(SELECTORS.host.nextButton)).toBeVisible();
  });

  test('TC-17-13 호스트 User 카메라 영역', async () => {
    await expect(hostPage.locator('text=User').first()).toBeVisible();
  });

  test('TC-17-14 호스트 AI Screen 영역', async () => {
    await expect(hostPage.locator('text=AI Screen')).toBeVisible();
  });

  test('TC-17-15 호스트 메시지 입력 필드', async () => {
    await expect(hostPage.getByPlaceholder('메시지 입력')).toBeVisible();
  });
});
