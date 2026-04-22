import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { ROUTES, SELECTORS, TIMEOUTS } from '../../../src/config/constants.js';

/**
 * TC-21. 호스트 중복 접속 제어 검증 (멀티탭)
 *
 * 매일 자동 검증 목적: 다중 접속 제어 로직이 정상 동작하는지 확인
 *
 * 시나리오:
 *  1) 게스트 A 세션 접속
 *  2) 호스트 A 세션 진입 (성공해야 함)
 *  3) 호스트 B가 같은 세션에 동시 진입 시도 → **차단**되어야 함
 *  4) 호스트 A 세션 퇴장
 *  5) 호스트 B 재진입 → **성공**해야 함
 *
 * 실패 케이스:
 *  - 3단계 통과: 동시성 제어 버그 (중복 접속 허용됨)
 *  - 5단계 실패: 세션 해제 버그 (호스트 A 퇴장 후에도 차단됨)
 */

const GUEST_NAME = '해리';
const GUEST_PHONE = '4120';
const LESSON_INDEX = '17';
const SESSION_CARD = '해리_17회기';

test.describe('TC-21. 호스트 중복 접속 제어', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(300000);

  let guestContext: BrowserContext;
  let hostAContext: BrowserContext;
  let hostBContext: BrowserContext;
  let guestPage: Page;
  let hostAPage: Page;
  let hostBPage: Page;
  let guestReady = false;
  let hostAInSession = false;

  test.beforeAll(async ({ browser }) => {
    guestContext = await browser.newContext({ permissions: ['microphone', 'camera'] });
    hostAContext = await browser.newContext({
      storageState: 'auth/user.json',
      permissions: ['microphone', 'camera'],
    });
    hostBContext = await browser.newContext({
      storageState: 'auth/user-b.json',
      permissions: ['microphone', 'camera'],
    });
    guestPage = await guestContext.newPage();
    hostAPage = await hostAContext.newPage();
    hostBPage = await hostBContext.newPage();

    // ── 게스트 A 접속 & 시작 ──
    try {
      await guestPage.goto(ROUTES.guestTest);
      await guestPage.locator('input[placeholder*="이름"]').click();
      await guestPage.locator('input[placeholder*="이름"]').type(GUEST_NAME, { delay: 80 });
      await guestPage.locator('input[placeholder*="전화번호"]').fill(GUEST_PHONE);
      await guestPage.locator('input[placeholder*="인덱스"]').fill(LESSON_INDEX);
      await guestPage.waitForTimeout(3000);
      await guestPage.locator(SELECTORS.guest.enterButton).click();

      const fromStart = guestPage.locator(SELECTORS.guest.fromStartButton);
      const continueBtn = guestPage.locator(SELECTORS.guest.continueButton);
      const ready = guestPage.locator('text=준비됐나요');

      await expect(fromStart.or(continueBtn).or(ready).first()).toBeVisible({ timeout: 30000 });
      if (await fromStart.isVisible().catch(() => false)) {
        await fromStart.click();
      } else if (await continueBtn.isVisible().catch(() => false)) {
        await continueBtn.click();
      }
      await expect(ready).toBeVisible({ timeout: 60000 });
      await guestPage.getByRole('button', { name: '시작' }).click();
      await guestPage.waitForTimeout(5000);
      await expect(guestPage.locator('video').first()).toBeVisible({ timeout: TIMEOUTS.long });
      guestReady = true;
    } catch {
      guestReady = false;
    }
  });

  test.afterAll(async () => {
    await guestContext?.close();
    await hostAContext?.close();
    await hostBContext?.close();
  });

  // ───────────────────────────────────────────────────────────
  // STEP 1: 게스트 A 접속 확인
  // ───────────────────────────────────────────────────────────
  test('TC-21-01 게스트 A 접속 확인', async () => {
    test.skip(!guestReady, '게스트 진입 실패');
    await expect(guestPage.locator('video').first()).toBeVisible();
  });

  // ───────────────────────────────────────────────────────────
  // STEP 2: 호스트 A 세션 진입 성공
  // ───────────────────────────────────────────────────────────
  test('TC-21-02 호스트 A 세션 진입 성공', async () => {
    test.skip(!guestReady, '게스트 진입 실패');

    await hostAPage.goto(ROUTES.monitorDashboard);
    await hostAPage.waitForLoadState('networkidle');
    await expect(hostAPage.locator(`text=${SESSION_CARD}`)).toBeVisible({ timeout: TIMEOUTS.medium });
    await hostAPage.locator(`text=${SESSION_CARD}`).click();
    await hostAPage.waitForLoadState('domcontentloaded');

    // "수업을 시작합니다" 다이얼로그 → 시작
    const startBtn = hostAPage.getByRole('button', { name: '시작' });
    try {
      await startBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.long });
      await startBtn.click();
    } catch { /* 이미 활성 */ }
    await hostAPage.waitForTimeout(5000);

    // 세션 진입 성공 검증: URL 변화 + ACTIVITY 또는 자동 전환 토글
    expect(hostAPage.url()).not.toContain('/monitor-dashboard?');
    const activityVisible = await hostAPage.locator('text=ACTIVITY').first().isVisible().catch(() => false);
    const autoToggle = await hostAPage.getByText('자동 전환').isVisible().catch(() => false);
    const endClass = await hostAPage.locator('button:has-text("수업 종료")').isVisible().catch(() => false);

    hostAInSession = activityVisible || autoToggle || endClass;
    expect(hostAInSession, '호스트 A가 세션에 진입하지 못함').toBe(true);
  });

  // ───────────────────────────────────────────────────────────
  // STEP 3: 호스트 B 중복 진입 시도 → 차단되어야 함
  // ───────────────────────────────────────────────────────────
  test('TC-21-03 호스트 B 중복 진입 차단 검증', async () => {
    test.skip(!hostAInSession, '호스트 A 세션 진입 실패');

    await hostBPage.goto(ROUTES.monitorDashboard);
    await hostBPage.waitForLoadState('networkidle');
    await expect(hostBPage.locator(`text=${SESSION_CARD}`)).toBeVisible({ timeout: TIMEOUTS.medium });

    const urlBefore = hostBPage.url();
    await hostBPage.locator(`text=${SESSION_CARD}`).click();
    await hostBPage.waitForTimeout(5000);

    // 차단 검증: 아래 중 하나라도 참이면 정상 차단
    //  - URL이 그대로 (대시보드에서 못 벗어남)
    //  - ACTIVITY/시작 버튼이 안 보임
    //  - "확인 중" 또는 "이미 진행자 접속 중" 등 차단 메시지 표시
    const urlUnchanged = hostBPage.url() === urlBefore
      || hostBPage.url().includes('/monitor-dashboard');
    const noActivity = !(await hostBPage.locator('text=ACTIVITY').first().isVisible().catch(() => false));
    const noStartBtn = !(await hostBPage.getByRole('button', { name: '시작' }).isVisible().catch(() => false));
    const blockedMsg = await hostBPage.locator(
      'text=/이미|다른 진행자|사용 중|접속 중|확인 중/'
    ).first().isVisible().catch(() => false);

    const blocked = urlUnchanged && (noActivity || noStartBtn || blockedMsg);

    if (!blocked) {
      // 진입된 상태라면 → 동시성 제어 버그
      await hostBPage.screenshot({ path: 'test-results/TC-21-03-FAIL-host-B-entered.png' });
    }

    expect(blocked, [
      '호스트 B가 호스트 A 접속 중에 세션에 진입됨 (동시성 제어 버그)',
      `URL unchanged: ${urlUnchanged}`,
      `No ACTIVITY: ${noActivity}`,
      `No start button: ${noStartBtn}`,
      `Blocked message: ${blockedMsg}`,
    ].join(' | ')).toBe(true);
  });

  // ───────────────────────────────────────────────────────────
  // STEP 4: 호스트 A 세션 퇴장
  // ───────────────────────────────────────────────────────────
  test('TC-21-04 호스트 A 세션 퇴장', async () => {
    test.skip(!hostAInSession, '호스트 A 세션 진입 실패');

    // 옵션 1: "대시보드로 가기" 버튼이 있으면 클릭
    // 옵션 2: 없으면 대시보드 URL로 직접 이동 (실제 사용자가 URL 바꿔서 나간 경우 재현)
    const backBtn = hostAPage.locator('button:has-text("대시보드"), a:has-text("대시보드")');
    if (await backBtn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await backBtn.first().click();
    } else {
      await hostAPage.goto(ROUTES.monitorDashboard);
    }
    await hostAPage.waitForLoadState('networkidle');

    // 호스트 A가 세션 페이지에서 나온 것 확인
    const stillInSession = await hostAPage.locator('text=ACTIVITY').first().isVisible().catch(() => false);
    expect(stillInSession, '호스트 A 퇴장 실패').toBe(false);

    // 서버 측 해제를 위한 대기
    await hostAPage.waitForTimeout(5000);
  });

  // ───────────────────────────────────────────────────────────
  // STEP 5: 호스트 B 재진입 → 성공해야 함
  // ───────────────────────────────────────────────────────────
  test('TC-21-05 호스트 A 퇴장 후 호스트 B 재진입 성공', async () => {
    test.skip(!hostAInSession, '호스트 A 세션 진입 실패');

    await hostBPage.goto(ROUTES.monitorDashboard);
    await hostBPage.waitForLoadState('networkidle');

    // 대시보드에서 "확인 중" 상태가 해소될 때까지 최대 30초 대기
    for (let i = 0; i < 10; i++) {
      const checking = await hostBPage.locator('text=확인 중').isVisible({ timeout: 1000 }).catch(() => false);
      if (!checking) break;
      await hostBPage.waitForTimeout(3000);
      await hostBPage.reload();
      await hostBPage.waitForLoadState('networkidle');
    }

    await expect(hostBPage.locator(`text=${SESSION_CARD}`)).toBeVisible({ timeout: TIMEOUTS.medium });
    await hostBPage.locator(`text=${SESSION_CARD}`).click();
    await hostBPage.waitForLoadState('domcontentloaded');

    // "시작" 다이얼로그 → 클릭
    const startBtn = hostBPage.getByRole('button', { name: '시작' });
    try {
      await startBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.long });
      await startBtn.click();
    } catch { /* 이미 활성 */ }
    await hostBPage.waitForTimeout(5000);

    // 호스트 B 진입 확인
    const activityVisible = await hostBPage.locator('text=ACTIVITY').first().isVisible().catch(() => false);
    const autoToggle = await hostBPage.getByText('자동 전환').isVisible().catch(() => false);
    const endClass = await hostBPage.locator('button:has-text("수업 종료")').isVisible().catch(() => false);

    const hostBEntered = activityVisible || autoToggle || endClass;

    if (!hostBEntered) {
      await hostBPage.screenshot({ path: 'test-results/TC-21-05-FAIL-host-B-blocked.png' });
    }

    expect(hostBEntered, '호스트 A 퇴장 후에도 호스트 B가 진입하지 못함 (세션 해제 버그)').toBe(true);
  });
});
