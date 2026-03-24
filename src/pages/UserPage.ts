import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { SELECTORS, ROUTES } from '../config/constants.js';

export class UserPage extends BasePage {
  private readonly s = SELECTORS.user;

  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.waitForVisible(this.s.addUserButton);
  }

  async goto(): Promise<void> {
    await this.navigateTo(ROUTES.user);
    await this.waitForReady();
  }

  async clickAddUser(): Promise<void> { await this.page.click(this.s.addUserButton); }

  async getUserCount(): Promise<number> {
    return this.page.locator('table tbody tr').count();
  }

  async isUserTableVisible(): Promise<boolean> {
    return this.page.locator(this.s.userTable).isVisible();
  }
}
