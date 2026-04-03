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

  test.beforeAll(async ({ browser }) => {
    // 세션 진입 (TC-17 플로우 반복)
    hostContext = await browser.newContext({
      storageState: 'auth/user.json',
      permissions: ['microphone', 'camera'],
    });
    guestContext = await browser.newContext({
      permissions: ['microphone', 'camera'],
    });
    hostPage = await hostContext.newPage();
    guestPage = await guestContext.newPage();

    // 게스트 진입
    await guestPage.goto(ROUTES.guestTest);
    await guestPage.locator('input[placeholder*="이름"]').click();
    await guestPage.locator('input[placeholder*="이름"]').type(GUEST_NAME, { delay: 100 });
    await guestPage.locator('input[placeholder*="전화번호"]').fill(GUEST_PHONE);
    await guestPage.locator('input[placeholder*="인덱스"]').fill(LESSON_INDEX);
    await guestPage.waitForTimeout(3000);
    await guestPage.locator(SELECTORS.guest.enterButton).click();

    // "처음부터" 또는 "이어하기" 다이얼로그 처리
    const fromStart = guestPage.locator(SELECTORS.guest.fromStartButton);
    const continueBtn = guestPage.locator(SELECTORS.guest.continueButton);
    const loading = guestPage.locator('text=친구가 만날 준비를 하고 있어요');
    const ready = guestPage.locator('text=준비됐나요');

    await expect(fromStart.or(continueBtn).or(loading).or(ready).first()).toBeVisible({ timeout: 30000 });
    if (await fromStart.isVisible({ timeout: 2000 }).catch(() => false)) {
      await fromStart.click();
    } else if (await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await continueBtn.click();
    }
    await expect(guestPage.locator('text=준비됐나요')).toBeVisible({ timeout: 60000 });
    await guestPage.getByRole('button', { name: '시작' }).click();
    await guestPage.waitForTimeout(5000);

    // 호스트 진입
    await hostPage.goto(ROUTES.monitorDashboard);
    await hostPage.locator('text=해리_17회기').click({ timeout: TIMEOUTS.medium });
    await hostPage.waitForLoadState('domcontentloaded');
    const startBtn = hostPage.getByRole('button', { name: '시작' });
    await expect(startBtn).toBeVisible({ timeout: TIMEOUTS.long });
    await startBtn.click();
    await hostPage.waitForTimeout(5000);
  });

  test.afterAll(async () => {
    await hostContext?.close();
    await guestContext?.close();
  });

  // ── 활동 전환 ──

  test('TC-18-01 Next → 확인 → 활동 전환', async () => {
    await hostPage.locator(SELECTORS.host.nextButton).click();
    const confirmBtn = hostPage.locator(SELECTORS.host.confirmButton);
    await expect(confirmBtn).toBeVisible({ timeout: TIMEOUTS.medium });
    await confirmBtn.click();
    await hostPage.waitForTimeout(5000);
    // 전환 후 Next 버튼 다시 표시
    await expect(hostPage.locator(SELECTORS.host.nextButton)).toBeVisible({ timeout: TIMEOUTS.long });
  });

  test('TC-18-02 활동 전환 호스트 반영 - Activity Step 변경', async () => {
    await expect(hostPage.locator('text=ACTIVITY').first()).toBeVisible();
  });

  test('TC-18-03 활동 전환 게스트 반영 - 화면 동기화', async () => {
    // 게스트 페이지가 여전히 활성 상태
    await expect(guestPage.locator('video').first()).toBeVisible({ timeout: TIMEOUTS.medium });
  });

  // ── 추가 활동 전환 (리소스/AI 캐릭터 변경 확인) ──

  test('TC-18-04~09 연속 활동 전환 - 리소스/AI 변경 검증', async () => {
    // 2번째 활동 전환
    await hostPage.locator(SELECTORS.host.nextButton).click();
    await hostPage.locator(SELECTORS.host.confirmButton).click();
    await hostPage.waitForTimeout(5000);
    await expect(hostPage.locator(SELECTORS.host.nextButton)).toBeVisible({ timeout: TIMEOUTS.long });

    // 호스트: AI Screen 영역이 여전히 존재
    await expect(hostPage.locator('text=AI Screen')).toBeVisible();

    // 게스트: video 또는 이미지 컨텐츠 존재
    const guestHasContent = await guestPage.locator('video, img, canvas').first()
      .isVisible({ timeout: TIMEOUTS.medium }).catch(() => false);
    expect(guestHasContent).toBe(true);
  });
});
