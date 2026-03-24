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
    const nameInput = this.page.locator(this.s.nameInput);
    await nameInput.click();
    await nameInput.clear();
    await nameInput.type(name, { delay: 50 });

    const pwInput = this.page.locator(this.s.passwordInput);
    await pwInput.click();
    await pwInput.clear();
    await pwInput.type(password, { delay: 50 });

    await this.page.click(this.s.submitButton);
  }

  async isLoginPage(): Promise<boolean> {
    return this.page.locator(this.s.submitButton).isVisible({ timeout: 3000 }).catch(() => false);
  }
}
