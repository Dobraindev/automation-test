import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { SELECTORS, TIMEOUTS } from '../config/constants.js';

export class HostSessionPage extends BasePage {
  private readonly s = SELECTORS.hostSession;

  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.waitForVisible(this.s.layoutContainer);
  }

  /**
   * 게스트 입장 승인 팝업이 나타날 때까지 대기
   */
  async waitForApprovalPopup(timeout = TIMEOUTS.long): Promise<void> {
    await this.page
      .locator(this.s.approvalOverlay)
      .waitFor({ state: 'visible', timeout });
  }

  /**
   * 게스트 입장 승인
   */
  async approveGuest(): Promise<void> {
    await this.waitForApprovalPopup();
    await this.page.click(this.s.approveButton);
  }

  /**
   * 게스트 입장 거부
   */
  async denyGuest(): Promise<void> {
    await this.waitForApprovalPopup();
    await this.page.click(this.s.denyButton);
  }

  /**
   * 승인 팝업의 텍스트 확인
   */
  async getApprovalText(): Promise<string | null> {
    await this.waitForApprovalPopup();
    return this.page.locator(this.s.approvalText).textContent();
  }

  /**
   * 승인 팝업이 닫혔는지 확인
   */
  async isApprovalPopupHidden(): Promise<boolean> {
    return this.page
      .locator(this.s.approvalOverlay)
      .isHidden();
  }
}
