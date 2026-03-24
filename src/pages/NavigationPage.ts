import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { ROUTES } from '../config/constants.js';

/**
 * 상단 네비게이션 바 - 모든 페이지에서 공통
 */
export class NavigationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.page.locator('nav, header').first().waitFor({ state: 'visible' });
  }

  async navigateToTab(tabName: string): Promise<void> {
    await this.page.getByRole('link', { name: tabName }).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getNavLinks(): Promise<string[]> {
    const links = this.page.locator('nav a, header a');
    const count = await links.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await links.nth(i).textContent();
      if (text?.trim()) texts.push(text.trim());
    }
    return texts;
  }

  async isLoggedIn(): Promise<boolean> {
    return this.page.locator('button:has-text("관리자")').isVisible({ timeout: 5000 }).catch(() => false);
  }

  async goToClassMgmt(): Promise<void> { await this.navigateTo(ROUTES.classMgmt); }
  async goToSchedule(): Promise<void> { await this.navigateTo(ROUTES.schedule); }
  async goToMonitor(): Promise<void> { await this.navigateTo(ROUTES.monitorDashboard); }
  async goToUser(): Promise<void> { await this.navigateTo(ROUTES.user); }
  async goToActivity(): Promise<void> { await this.navigateTo(ROUTES.activity); }
  async goToMessage(): Promise<void> { await this.navigateTo(ROUTES.message); }
  async goToResource(): Promise<void> { await this.navigateTo(ROUTES.resource); }
  async goToAvatar(): Promise<void> { await this.navigateTo(ROUTES.avatar); }
  async goToActivityTemplate(): Promise<void> { await this.navigateTo(ROUTES.activityTemplate); }
  async goToLessonTemplate(): Promise<void> { await this.navigateTo(ROUTES.lessonTemplate); }
  async goToCurriculum(): Promise<void> { await this.navigateTo(ROUTES.curriculum); }
  async goToPromptVariable(): Promise<void> { await this.navigateTo(ROUTES.promptVariable); }
  async goToLog(): Promise<void> { await this.navigateTo(ROUTES.log); }
  async goToPromptTest(): Promise<void> { await this.navigateTo(ROUTES.promptTest); }
  async goToEmergencyClass(): Promise<void> { await this.navigateTo(ROUTES.emergencyClass); }
  async goToMember(): Promise<void> { await this.navigateTo(ROUTES.member); }
}
