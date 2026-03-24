import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { SELECTORS, TIMEOUTS } from '../config/constants.js';

export class GuestSessionPage extends BasePage {
  private readonly s = SELECTORS.guestSession;

  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.waitForVisible(this.s.meetContainer);
  }

  /**
   * 마이크 토글
   */
  async toggleMic(): Promise<void> {
    await this.page.click(this.s.micButton);
  }

  /**
   * 나가기 클릭
   */
  async exit(): Promise<void> {
    await this.page.click(this.s.exitButton);
  }

  /**
   * 연결 상태 확인
   */
  async hasConnectionError(): Promise<boolean> {
    return this.page.locator(this.s.connectionStatus).isVisible();
  }

  /**
   * 다시 시도 버튼 클릭
   */
  async retry(): Promise<void> {
    await this.page.click(this.s.retryButton);
  }

  /**
   * 치료사 영역 로딩 완료 대기
   */
  async waitForTherapistArea(timeout = TIMEOUTS.long): Promise<void> {
    await this.page
      .locator(this.s.therapistArea)
      .waitFor({ state: 'visible', timeout });
  }

  /**
   * 게스트 비디오 영역 확인
   */
  async isChildAreaVisible(): Promise<boolean> {
    return this.page.locator(this.s.childArea).isVisible();
  }
}
