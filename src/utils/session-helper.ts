import type { Page, Locator } from '@playwright/test';

/**
 * "수업을 시작합니다" 다이얼로그가 떠있으면 닫기.
 *
 * 1.65.0+: 게스트 재접속 등으로 시작 다이얼로그가 주기적으로 다시 떠오르므로
 * 활동 전환/수업 종료 등 핵심 동작 전에 호출해서 다이얼로그를 정리한다.
 */
/**
 * 모달 오버레이를 무시하고 버튼 텍스트로 JavaScript click을 직접 발생시킨다.
 * "수업 종료" 같은 버튼이 모달에 가려진 경우에도 동작.
 */
export async function clickButtonByText(page: Page, text: string): Promise<boolean> {
  return await page.evaluate((t) => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => b.textContent?.trim().includes(t));
    if (target) {
      (target as HTMLElement).click();
      return true;
    }
    return false;
  }, text).catch(() => false);
}

export async function dismissStartDialog(page: Page, attempts = 5): Promise<void> {
  for (let i = 0; i < attempts; i++) {
    const startBtn = page.getByRole('button', { name: '시작' });
    if (!(await startBtn.isVisible({ timeout: 1500 }).catch(() => false))) return;
    await startBtn.click({ force: true }).catch(() => {});
    await page.waitForTimeout(1000);
  }
  // 그래도 남아있는 모달은 DOM에서 강제 제거 (시작 다이얼로그 텍스트 포함 모달 + 오버레이)
  await page.evaluate(() => {
    const removeIfFixed = (el: Element) => {
      let parent: Element | null = el;
      while (parent) {
        const cls = (parent as HTMLElement).className?.toString() || '';
        if (cls.includes('fixed') || cls.includes('inset-0') || cls.includes('z-')) {
          parent.remove();
          return;
        }
        parent = parent.parentElement;
      }
    };
    // "수업을 시작합니다" 텍스트가 있는 모달 제거
    document.querySelectorAll('div').forEach(el => {
      if (el.textContent?.includes('수업을 시작합니다')
        || el.textContent?.includes('해리님이 접속했습니다')) {
        removeIfFixed(el);
      }
    });
    document.querySelectorAll('[role="dialog"]').forEach(el => el.remove());
    document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
  }).catch(() => {});
}

/**
 * 모니터 대시보드에서 세션에 진입하는 헬퍼.
 *
 * release 별 진입 방식 차이를 흡수:
 *  - 1.64.0 이하: 세션 카드 텍스트 자체를 클릭
 *  - 1.65.0+: 카드 옆의 "실시간 입장" 버튼 클릭
 *
 * @param page 호스트 페이지 (모니터 대시보드 상태)
 * @param sessionRegex 세션 카드 매칭 정규식 (예: /해리[ _]?17회기/)
 */
export async function enterSessionFromDashboard(
  page: Page,
  sessionRegex: RegExp,
  timeout = 15000
): Promise<void> {
  const card = page.getByText(sessionRegex).first();
  await card.waitFor({ state: 'visible', timeout });

  // 카드와 같은 row 컨테이너 안에 "실시간 입장" 버튼이 있으면 그걸 클릭 (1.65.0+)
  const rowContainer = card.locator(
    'xpath=ancestor::div[descendant::button[contains(text(), "실시간 입장")]][1]'
  );
  const enterBtn: Locator = rowContainer.locator('button:has-text("실시간 입장")');

  if (await enterBtn.first().isVisible({ timeout: 2000 }).catch(() => false)) {
    await enterBtn.first().click();
  } else {
    // 이전 release: 카드 자체 클릭
    await card.click();
  }
}
