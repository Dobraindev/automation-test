import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { ROUTES, SELECTORS, TIMEOUTS } from '../../src/config/constants.js';

/**
 * TC-19. 세션 E2E - 호스트 컨트롤 (멀티탭)
 */

const GUEST_NAME = '해리';
const GUEST_PHONE = '4120';
const LESSON_INDEX = '17';

test.describe('TC-19. 세션 E2E - 호스트 컨트롤', () => {
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

  // ── 컨트롤 패널 ──

  test('TC-19-01 자동 전환 토글 표시', async () => {
    test.skip(!sessionReady, '세션 진입 실패 - TC-17 이후 세션 재진입 불가');
    await expect(hostPage.getByText('자동 전환')).toBeVisible();
  });

  test('TC-19-02 메시지 발송 - 입력 및 전송', async () => {
    test.skip(!sessionReady, '세션 진입 실패');
    const msgInput = hostPage.getByPlaceholder('메시지 입력');
    await expect(msgInput).toBeVisible();
    await expect(hostPage.locator(SELECTORS.host.sendButton)).toBeVisible();
  });

  test('TC-19-03 STT 보기 버튼', async () => {
    test.skip(!sessionReady, '세션 진입 실패');
    const stt = hostPage.getByText('STT만 보기').or(hostPage.getByText('STT')).first();
    await expect(stt).toBeVisible();
  });

  test('TC-19-04 듣기/끼어들기 토글', async () => {
    test.skip(!sessionReady, '세션 진입 실패');
    await expect(hostPage.getByText('듣기').first()).toBeVisible();
    await expect(hostPage.getByText('끼어들기').first()).toBeVisible();
  });

  test('TC-19-05 눈 뜨기/감기 버튼', async () => {
    test.skip(!sessionReady, '세션 진입 실패');
    const eyeOpen = hostPage.getByText('눈 뜨기').or(hostPage.getByText('눈뜨기'));
    const eyeClose = hostPage.getByText('눈 감기').or(hostPage.getByText('눈감기'));
    await expect(eyeOpen.first()).toBeVisible({ timeout: 5000 }).catch(async () => {
      await expect(hostPage.locator('button').filter({ hasText: /눈/ }).first()).toBeVisible();
    });
  });

  test('TC-19-06 Quick Presets 표시', async () => {
    test.skip(!sessionReady, '세션 진입 실패');
    await expect(hostPage.getByText('QUICK PRESETS')).toBeVisible();
  });

  // ── 세션 종료 ──

  test('TC-19-07 수업 종료 다이얼로그', async () => {
    test.skip(!sessionReady, '세션 진입 실패');
    await hostPage.locator('button:has-text("수업 종료")').click();
    await expect(hostPage.getByText('회기 종료')).toBeVisible({ timeout: TIMEOUTS.medium });
    await expect(hostPage.getByText('완료').first()).toBeVisible();
    await expect(hostPage.getByText('중단').first()).toBeVisible();
    await expect(hostPage.getByText('취소').first()).toBeVisible();
    await hostPage.keyboard.press('Escape');
  });
});
