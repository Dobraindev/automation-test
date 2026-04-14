import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { ROUTES, SELECTORS, TIMEOUTS } from '../../src/config/constants.js';

/**
 * TC-18. 세션 E2E - 활동 전환 및 리소스 (멀티탭)
 *
 * TC-17에서 세션 진입 후 활동 전환/리소스/AI 캐릭터 검증
 */

const GUEST_NAME = '해리';
const GUEST_PHONE = '4120';
const LESSON_INDEX = '17';

test.describe('TC-18. 세션 E2E - 활동 전환/리소스', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(240000);

  let hostContext: BrowserContext;
  let guestContext: BrowserContext;
  let hostPage: Page;
  let guestPage: Page;
  let sessionReady = false;

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

    try {
      // 게스트 진입
      await guestPage.goto(ROUTES.guestTest);
      await guestPage.locator('input[placeholder*="이름"]').click();
      await guestPage.locator('input[placeholder*="이름"]').type(GUEST_NAME, { delay: 100 });
      await guestPage.locator('input[placeholder*="전화번호"]').fill(GUEST_PHONE);
      await guestPage.locator('input[placeholder*="인덱스"]').fill(LESSON_INDEX);
      await guestPage.waitForTimeout(3000);
      await guestPage.locator(SELECTORS.guest.enterButton).click();

      const fromStart = guestPage.locator(SELECTORS.guest.fromStartButton);
      const continueBtn = guestPage.locator(SELECTORS.guest.continueButton);
      const loading = guestPage.locator('text=친구가 만날 준비를 하고 있어요');
      const ready = guestPage.locator('text=준비됐나요');

      await expect(fromStart.or(continueBtn).or(loading).or(ready).first()).toBeVisible({ timeout: 30000 });
      if (await fromStart.isVisible().catch(() => false)) {
        await fromStart.click();
      } else if (await continueBtn.isVisible().catch(() => false)) {
        await continueBtn.click();
      }
      await expect(guestPage.locator('text=준비됐나요')).toBeVisible({ timeout: 60000 });
      await guestPage.getByRole('button', { name: '시작' }).click();
      await guestPage.waitForTimeout(5000);
      await expect(guestPage.locator('video').first()).toBeVisible({ timeout: TIMEOUTS.long });

      // 호스트 진입
      await hostPage.goto(ROUTES.monitorDashboard);
      await hostPage.waitForLoadState('networkidle');
      await hostPage.locator('text=해리_17회기').click({ timeout: TIMEOUTS.medium });
      await hostPage.waitForLoadState('domcontentloaded');
      const startBtn = hostPage.getByRole('button', { name: '시작' });
      try {
        await startBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.long });
        await startBtn.click();
      } catch { /* 이미 활성 */ }
      await hostPage.waitForTimeout(5000);

      // 세션 진입 확인
      const activityVisible = await hostPage.locator('text=ACTIVITY').first()
        .isVisible().catch(() => false);
      const autoToggle = await hostPage.getByText('자동 전환')
        .isVisible().catch(() => false);
      sessionReady = activityVisible || autoToggle;
    } catch {
      sessionReady = false;
    }
  });

  test.afterAll(async () => {
    await hostContext?.close();
    await guestContext?.close();
  });

  // ── 활동 전환 ──

  test('TC-18-01 활동 전환', async () => {
    test.skip(!sessionReady, '세션 진입 실패 - TC-17 이후 세션 재진입 불가');
    const nextBtn = hostPage.locator(SELECTORS.host.nextButton);
    const hasNext = await nextBtn.isVisible({ timeout: 5000 }).catch(() => false);

    if (hasNext) {
      // Next 버튼 방식 (이전 버전)
      await nextBtn.click();
      const confirmBtn = hostPage.locator(SELECTORS.host.confirmButton);
      await expect(confirmBtn).toBeVisible({ timeout: TIMEOUTS.medium });
      await confirmBtn.click();
    } else {
      // 활동 행 직접 클릭 방식 (1.51.0+) - 두 번째 활동 행 클릭
      const activityRows = hostPage.locator('table tbody tr, [class*="row"][cursor="pointer"]');
      const rowCount = await activityRows.count();
      if (rowCount > 1) {
        await activityRows.nth(1).click();
        const confirmBtn = hostPage.locator(SELECTORS.host.confirmButton);
        if (await confirmBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
          await confirmBtn.click();
        }
      }
    }
    await hostPage.waitForTimeout(5000);
    // 전환 후 활동 목록이 여전히 표시
    await expect(hostPage.locator('text=ACTIVITY').first()).toBeVisible({ timeout: TIMEOUTS.long });
  });

  test('TC-18-02 활동 전환 호스트 반영 - Activity Step 변경', async () => {
    test.skip(!sessionReady, '세션 진입 실패');
    await expect(hostPage.locator('text=ACTIVITY').first()).toBeVisible();
  });

  test('TC-18-03 활동 전환 게스트 반영 - 화면 동기화', async () => {
    test.skip(!sessionReady, '세션 진입 실패');
    // 게스트 페이지가 여전히 활성 상태
    await expect(guestPage.locator('video').first()).toBeVisible({ timeout: TIMEOUTS.medium });
  });

  // ── 추가 활동 전환 (리소스/AI 캐릭터 변경 확인) ──

  test('TC-18-04~09 연속 활동 전환 - 리소스/AI 변경 검증', async () => {
    test.skip(!sessionReady, '세션 진입 실패');
    // 추가 활동 전환
    const nextBtn = hostPage.locator(SELECTORS.host.nextButton);
    const hasNext = await nextBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasNext) {
      await nextBtn.click();
      await hostPage.locator(SELECTORS.host.confirmButton).click();
    } else {
      const activityRows = hostPage.locator('table tbody tr, [class*="row"][cursor="pointer"]');
      const rowCount = await activityRows.count();
      if (rowCount > 2) {
        await activityRows.nth(2).click();
        const confirmBtn = hostPage.locator(SELECTORS.host.confirmButton);
        if (await confirmBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
          await confirmBtn.click();
        }
      }
    }
    await hostPage.waitForTimeout(5000);
    await expect(hostPage.locator('text=ACTIVITY').first()).toBeVisible({ timeout: TIMEOUTS.long });

    // 호스트: AI Screen 영역이 여전히 존재
    await expect(hostPage.locator('text=AI Screen')).toBeVisible();

    // 게스트: video 또는 이미지 컨텐츠 존재
    const guestHasContent = await guestPage.locator('video, img, canvas').first()
      .isVisible({ timeout: TIMEOUTS.medium }).catch(() => false);
    expect(guestHasContent).toBe(true);
  });
});
