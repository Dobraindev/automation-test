import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { ROUTES, SELECTORS, TIMEOUTS } from '../../../src/config/constants.js';

/**
 * 모니터 대시보드 → 게스트/호스트 멀티탭 세션 테스트
 *
 * 플로우:
 * 1. 호스트(관리자): 모니터 대시보드 진입
 * 2. 게스트(비로그인): 테스트 페이지 → 이름/전화번호/인덱스 입력 → 입장 → 시작
 * 3. 호스트: 해리_17회기 클릭 → 시작
 * 4. 양쪽 세션 검증 + 활동 전환
 */

const GUEST_NAME = '해리';
const GUEST_PHONE = '4120';
const LESSON_INDEX = '17';
const GUEST_TEST_URL = '/client-guest?mode=test';

test.describe('모니터 대시보드 - 멀티탭 세션', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(120000); // 세션 테스트는 시간이 오래 걸림

  let hostContext: BrowserContext;
  let guestContext: BrowserContext;
  let hostPage: Page;
  let guestPage: Page;

  test.beforeAll(async ({ browser }) => {
    // 호스트: 로그인된 관리자 컨텍스트
    hostContext = await browser.newContext({
      storageState: 'auth/user.json',
      permissions: ['microphone', 'camera'],
    });
    // 게스트: 비로그인 독립 컨텍스트 (쿠키/세션 완전 분리)
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

  test('1. 모니터 대시보드에서 테스트 페이지 주소 복사 버튼이 보인다', async () => {
    await hostPage.goto(ROUTES.monitorDashboard);
    await expect(hostPage.locator('text=모니터 대시보드')).toBeVisible({ timeout: TIMEOUTS.medium });
    await expect(hostPage.locator(SELECTORS.monitor.testPageCopyButton)).toBeVisible();
  });

  test('2. 게스트 테스트 페이지에 접속하면 3개 입력 폼이 표시된다', async () => {
    await guestPage.goto(GUEST_TEST_URL);
    // 비로그인 상태 → 이름/전화번호/인덱스 3개 필드
    await expect(guestPage.locator('input[placeholder*="이름"]')).toBeVisible({ timeout: TIMEOUTS.medium });
    await expect(guestPage.locator('input[placeholder*="전화번호"]')).toBeVisible();
    await expect(guestPage.locator('input[placeholder*="인덱스"]')).toBeVisible();
    await expect(guestPage.locator(SELECTORS.guest.enterButton)).toBeVisible();
  });

  test('3. 게스트가 정보 입력 후 입장할 수 있다', async () => {
    // 이름 입력 (한글 → type 사용)
    const nameInput = guestPage.locator('input[placeholder*="이름"]');
    await nameInput.click();
    await nameInput.type(GUEST_NAME, { delay: 100 });

    // 전화번호 입력 (숫자 → fill 사용)
    const phoneInput = guestPage.locator('input[placeholder*="전화번호"]');
    await phoneInput.click();
    await phoneInput.fill(GUEST_PHONE);

    // 수업 인덱스 입력 (숫자 → fill 사용, IME 방지)
    const indexInput = guestPage.locator('input[placeholder*="인덱스"]');
    await indexInput.click();
    await indexInput.fill(LESSON_INDEX);

    // 장치 권한 로딩 대기
    await guestPage.waitForTimeout(3000);

    // 버튼 활성화 대기 후 클릭
    await expect(guestPage.locator(SELECTORS.guest.enterButton)).toBeEnabled({ timeout: 15000 });
    await guestPage.locator(SELECTORS.guest.enterButton).click();

    // "이전에 진행한 수업이 있어요" 다이얼로그 OR 로딩 화면 대기
    const fromStartBtn = guestPage.locator(SELECTORS.guest.fromStartButton);
    const loadingText = guestPage.locator('text=친구가 만날 준비를 하고 있어요');
    const readyText = guestPage.locator('text=준비됐나요');

    await expect(fromStartBtn.or(loadingText).or(readyText).first()).toBeVisible({ timeout: TIMEOUTS.long });

    // "처음부터" 버튼이 있으면 클릭
    if (await fromStartBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await fromStartBtn.click();
    }
  });

  test('4. 게스트 리소스 로딩 완료 후 시작 버튼이 표시된다', async () => {
    // "준비됐나요?" 화면 대기 (리소스 로딩 최대 60초)
    await expect(guestPage.locator('text=준비됐나요')).toBeVisible({ timeout: 60000 });

    const startButton = guestPage.getByRole('button', { name: '시작' });
    await expect(startButton).toBeVisible();
    await startButton.click();
    await guestPage.waitForTimeout(5000);
  });

  test('5. 게스트 페이지에 카메라 피드가 표시된다', async () => {
    const video = guestPage.locator('video');
    await expect(video.first()).toBeVisible({ timeout: TIMEOUTS.medium });
  });

  test('6. 호스트 모니터 대시보드에 해리_17회기가 나타난다', async () => {
    await hostPage.goto(ROUTES.monitorDashboard);
    await hostPage.waitForLoadState('domcontentloaded');

    const sessionEntry = hostPage.locator('text=해리_17회기');
    await expect(sessionEntry).toBeVisible({ timeout: TIMEOUTS.medium });
  });

  test('7. 호스트가 해리_17회기에 입장하고 시작할 수 있다', async () => {
    await hostPage.locator('text=해리_17회기').click();
    await hostPage.waitForLoadState('domcontentloaded');

    // "수업을 시작합니다" 다이얼로그 → 시작 클릭
    const startBtn = hostPage.getByRole('button', { name: '시작' });
    await expect(startBtn).toBeVisible({ timeout: TIMEOUTS.long });
    await startBtn.click();
    await hostPage.waitForTimeout(5000);
  });

  test('8. 호스트 페이지에 활동 목록과 전환 UI가 표시된다', async () => {
    await expect(hostPage.locator('text=ACTIVITY').first()).toBeVisible({ timeout: TIMEOUTS.medium });
    // Next 버튼 또는 자동 전환 (release에 따라 다름)
    const nextBtn = hostPage.locator(SELECTORS.host.nextButton);
    const autoToggle = hostPage.getByText('자동 전환');
    await expect(nextBtn.or(autoToggle).first()).toBeVisible({ timeout: TIMEOUTS.medium });
  });

  test('9. 호스트 페이지에 User/AI Screen 영역이 표시된다', async () => {
    await expect(hostPage.locator('text=User').first()).toBeVisible();
    await expect(hostPage.locator('text=AI Screen')).toBeVisible();
  });

  test('10. 호스트 페이지에 메시지 입력 필드가 표시된다', async () => {
    await expect(hostPage.getByPlaceholder('메시지 입력')).toBeVisible({ timeout: TIMEOUTS.medium });
  });

  test('11. 호스트에서 활동 전환이 동작한다', async () => {
    const nextBtn = hostPage.locator(SELECTORS.host.nextButton);
    const hasNext = await nextBtn.isVisible({ timeout: 5000 }).catch(() => false);

    if (hasNext) {
      // Next 버튼 방식
      await nextBtn.click();
      const confirmBtn = hostPage.locator(SELECTORS.host.confirmButton);
      await expect(confirmBtn).toBeVisible({ timeout: TIMEOUTS.medium });
      await confirmBtn.click();
    } else {
      // 활동 행 클릭 방식 (1.51.0+)
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

    // 전환 완료 대기 → 활동 목록이 여전히 표시
    await hostPage.waitForTimeout(5000);
    await expect(hostPage.locator('text=ACTIVITY').first()).toBeVisible({ timeout: TIMEOUTS.long });
  });

  test('12. 수업 종료 다이얼로그에 완료/중단/취소 옵션이 있다', async () => {
    await hostPage.locator('button:has-text("수업 종료")').click();

    await expect(hostPage.locator('text=회기 종료')).toBeVisible({ timeout: TIMEOUTS.medium });
    await expect(hostPage.locator('text=완료').first()).toBeVisible();
    await expect(hostPage.locator('text=중단').first()).toBeVisible();
    await expect(hostPage.locator('text=취소').first()).toBeVisible();

    // 다이얼로그 닫기
    await hostPage.keyboard.press('Escape');
  });
});
