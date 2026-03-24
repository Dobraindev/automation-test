import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { SELECTORS, ROUTES } from '../config/constants.js';

export class ClassMgmtPage extends BasePage {
  private readonly s = SELECTORS.classMgmt;

  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.waitForVisible(this.s.addClassButton);
  }

  async goto(): Promise<void> {
    await this.navigateTo(ROUTES.classMgmt);
    await this.waitForReady();
  }

  async clickTodayTab(): Promise<void> { await this.page.click(this.s.todayTab); }
  async clickAllTab(): Promise<void> { await this.page.click(this.s.allTab); }
  async clickStopTab(): Promise<void> { await this.page.click(this.s.stopTab); }

  async searchChild(name: string): Promise<void> {
    await this.page.fill(this.s.searchInput, name);
    await this.page.click(this.s.searchButton);
  }

  async clickToday(): Promise<void> { await this.page.click(this.s.todayButton); }
  async clickAddClass(): Promise<void> { await this.page.click(this.s.addClassButton); }
}
