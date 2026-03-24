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

  async login(name: string, password: string): Promise<void> {
    await this.page.fill(this.s.nameInput, name);
    await this.page.fill(this.s.passwordInput, password);
    await this.page.click(this.s.submitButton);
  }

  async isLoginPage(): Promise<boolean> {
    return this.page.locator(this.s.submitButton).isVisible({ timeout: 3000 }).catch(() => false);
  }
}
