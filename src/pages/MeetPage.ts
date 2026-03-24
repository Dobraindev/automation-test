import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { SELECTORS, ROUTES } from '../config/constants.js';

export class MeetPage extends BasePage {
  private readonly s = SELECTORS.meet;

  constructor(
    page: Page,
    private readonly userId: string
  ) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.waitForVisible(this.s.roomNameInput);
  }

  async goto(): Promise<void> {
    await this.navigateTo(ROUTES.hostMeet(this.userId));
    await this.waitForReady();
  }

  async createRoom(roomName: string): Promise<void> {
    await this.page.fill(this.s.roomNameInput, roomName);
    await this.page.click(this.s.createRoomButton);
  }

  async getRoomCount(): Promise<number> {
    return this.page.locator(this.s.roomItem).count();
  }

  async deleteRoom(index = 0): Promise<void> {
    await this.page.locator(this.s.deleteRoomButton).nth(index).click();
  }

  async clickRecentRoom(index = 0): Promise<void> {
    await this.page.locator(this.s.recentRoomButton).nth(index).click();
  }

  async getGuestUrl(roomName: string): Promise<string> {
    const baseUrl = this.page.url().split('/app/')[0];
    return `${baseUrl}/app/guest/${roomName}`;
  }
}
