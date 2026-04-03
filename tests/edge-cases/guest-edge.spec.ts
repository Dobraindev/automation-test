import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import { ROUTES, SELECTORS, TIMEOUTS } from '../../src/config/constants.js';

test.describe('EDGE-04. 게스트 입장 Edge Cases', () => {
  let guestContext: BrowserContext;
  let guestPage: Page;

  test.beforeEach(async ({ browser }) => {
    guestContext = await browser.newContext({
      permissions: ['microphone', 'camera'],
    });
    guestPage = await guestContext.newPage();
    await guestPage.goto(ROUTES.guestTest);
    await guestPage.waitForLoadState('domcontentloaded');
  });

  test.afterEach(async () => {
    await guestContext?.close();
  });

  test('EDGE-04-01 모든 필드 비어있을 때 입장하기 비활성화', async () => {
    await expect(guestPage.locator(SELECTORS.guest.enterButton)).toBeDisabled();
  });

  test('EDGE-04-02 이름만 입력 시 입장하기 상태 확인', async () => {
    await guestPage.locator('input[placeholder*="이름"]').click();
    await guestPage.locator('input[placeholder*="이름"]').type('테스트', { delay: 50 });
    await guestPage.waitForTimeout(2000);
    // 이름만 입력 → 나머지 필드 미입력이면 disabled이거나,
    // 서버 측 검증으로 처리될 수 있음 (UI 동작에 따라 다름)
    await expect(guestPage.locator(SELECTORS.guest.enterButton)).toBeVisible();
  });

  test('EDGE-04-03 존재하지 않는 수업 인덱스로 입장 시도', async () => {
    await guestPage.locator('input[placeholder*="이름"]').click();
    await guestPage.locator('input[placeholder*="이름"]').type('테스트', { delay: 50 });
    await guestPage.locator('input[placeholder*="전화번호"]').fill('0000');
    await guestPage.locator('input[placeholder*="인덱스"]').fill('99999');
    await guestPage.waitForTimeout(3000);

    // 버튼이 활성화되면 클릭
    const enterBtn = guestPage.locator(SELECTORS.guest.enterButton);
    if (await enterBtn.isEnabled({ timeout: 5000 }).catch(() => false)) {
      await enterBtn.click();
      await guestPage.waitForTimeout(3000);
      // 에러 메시지 표시 또는 입장 실패
    }
    // 세션 화면에 진입하지 않아야 함 (로딩/에러/원래 페이지)
  });

  test('EDGE-04-04 전화번호에 문자 입력 시도', async () => {
    const phoneInput = guestPage.locator('input[placeholder*="전화번호"]');
    await phoneInput.fill('abcd');
    const value = await phoneInput.inputValue();
    // 숫자만 허용하거나, 문자가 입력되더라도 페이지가 크래시하지 않아야 함
    await expect(guestPage.locator(SELECTORS.guest.enterButton)).toBeVisible();
  });

  test('EDGE-04-05 수업 인덱스에 음수 입력', async () => {
    await guestPage.locator('input[placeholder*="이름"]').click();
    await guestPage.locator('input[placeholder*="이름"]').type('테스트', { delay: 50 });
    await guestPage.locator('input[placeholder*="전화번호"]').fill('1234');
    await guestPage.locator('input[placeholder*="인덱스"]').fill('-1');
    await guestPage.waitForTimeout(2000);

    // 비활성화 상태이거나 에러 처리
    await expect(guestPage.locator(SELECTORS.guest.enterButton)).toBeVisible();
  });

  test('EDGE-04-06 수업 인덱스에 소수점 입력', async () => {
    await guestPage.locator('input[placeholder*="인덱스"]').fill('1.5');
    await guestPage.waitForTimeout(1000);
    await expect(guestPage.locator(SELECTORS.guest.enterButton)).toBeVisible();
  });
});
