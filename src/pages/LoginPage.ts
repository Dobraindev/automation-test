import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { SELECTORS, ROUTES } from '../config/constants.js';

export class LoginPage extends BasePage {
  private readonly s = SELECTORS.login;

  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.waitForVisible(this.s.submitButton);
  }

  async goto(): Promise<void> {
    await this.navigateTo(ROUTES.home);
    await this.waitForReady();
  }

  async login(userId: string, accessToken: string): Promise<void> {
    await this.page.fill(this.s.userIdInput, userId);
    await this.page.fill(this.s.accessTokenInput, accessToken);
    await this.page.click(this.s.submitButton);
  }

  async getErrorMessage(): Promise<string | null> {
    const error = this.page.locator(this.s.errorMessage);
    if (await error.isVisible({ timeout: 3000 }).catch(() => false)) {
      return error.textContent();
    }
    return null;
  }

  async getSubmitButtonText(): Promise<string | null> {
    return this.page.locator(this.s.submitButton).textContent();
  }
}
