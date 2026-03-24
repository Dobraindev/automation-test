import type { Page, Locator } from '@playwright/test';
import { TIMEOUTS } from '../config/constants.js';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * 페이지가 준비될 때까지 대기 (하위 클래스에서 구현)
   */
  abstract waitForReady(): Promise<void>;

  /**
   * 특정 URL로 이동
   */
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /**
   * 현재 URL 반환
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * 요소가 보일 때까지 대기
   */
  async waitForVisible(selector: string, timeout = TIMEOUTS.medium): Promise<Locator> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout });
    return locator;
  }

  /**
   * 스크린샷 촬영
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  /**
   * 텍스트가 페이지에 나타날 때까지 대기
   */
  async waitForText(text: string, timeout = TIMEOUTS.medium): Promise<void> {
    await this.page.getByText(text).waitFor({ state: 'visible', timeout });
  }
}
