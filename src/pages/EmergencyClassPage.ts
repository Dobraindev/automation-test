import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { SELECTORS, ROUTES } from '../config/constants.js';

/**
 * (비상용) 수업 페이지 - 호스트/게스트 세션 생성 핵심
 */
export class EmergencyClassPage extends BasePage {
  private readonly s = SELECTORS.emergencyClass;

  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.waitForVisible(this.s.startButton);
  }

  async goto(): Promise<void> {
    await this.navigateTo(ROUTES.emergencyClass);
    await this.waitForReady();
  }

  async selectChild(index: number): Promise<void> {
    const select = this.page.locator('select').nth(0);
    const options = select.locator('option');
    const count = await options.count();
    if (index < count) {
      const value = await options.nth(index).getAttribute('value');
      if (value) await select.selectOption(value);
    }
  }

  async clickStartClass(): Promise<void> {
    await this.page.click(this.s.startButton);
  }

  async hasRoomList(): Promise<boolean> {
    return this.page.locator(this.s.roomList).isVisible({ timeout: 5000 }).catch(() => false);
  }

  async getRoomCount(): Promise<number> {
    // 방 목록 아래 항목 수
    const noRoom = await this.page.getByText('생성된 방이 없습니다').isVisible().catch(() => false);
    if (noRoom) return 0;
    return this.page.locator('ul li, .room-item').count();
  }
}
