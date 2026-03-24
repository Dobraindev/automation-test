import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { SELECTORS, TIMEOUTS } from '../config/constants.js';

export class GuestEntryPage extends BasePage {
  private readonly s = SELECTORS.guestEntry;

  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.waitForVisible(this.s.enterButton);
  }

  async navigateToRoom(guestUrl: string): Promise<void> {
    await this.page.goto(guestUrl, { waitUntil: 'domcontentloaded' });
  }

  async clickEnter(): Promise<void> {
    await this.page.click(this.s.enterButton);
  }

  async isWaiting(): Promise<boolean> {
    return this.page.locator(this.s.waitingBox).isVisible();
  }

  async isDenied(): Promise<boolean> {
    return this.page.locator(this.s.deniedBox).isVisible();
  }

  async waitForAdmission(): Promise<void> {
    // 대기 상태가 사라지고 세션 페이지로 전환될 때까지 대기
    await this.page
      .locator(this.s.waitingBox)
      .waitFor({ state: 'hidden', timeout: TIMEOUTS.long });
  }

  async hasError(): Promise<boolean> {
    return this.page.locator(this.s.errorMessage).isVisible();
  }

  async enterRoom(guestUrl: string): Promise<void> {
    await this.navigateToRoom(guestUrl);
    await this.waitForReady();
    await this.clickEnter();
  }
}
