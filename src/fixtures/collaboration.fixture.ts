import { test as base, type Page, type BrowserContext } from '@playwright/test';
import { EmergencyClassPage } from '../pages/EmergencyClassPage.js';
import { NavigationPage } from '../pages/NavigationPage.js';

type CollaborationFixtures = {
  hostPage: Page;
  guestPage: Page;
  hostContext: BrowserContext;
  guestContext: BrowserContext;
  hostNav: NavigationPage;
  hostClass: EmergencyClassPage;
};

/**
 * 호스트/게스트 듀얼 컨텍스트 fixture
 * 호스트: 로그인된 관리자
 * 게스트: 별도 컨텍스트 (게스트 방 입장 링크로 접근)
 */
export const collaborationTest = base.extend<CollaborationFixtures>({
  hostContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'auth/user.json',
      permissions: ['microphone', 'camera'],
    });
    await use(context);
    await context.close();
  },

  guestContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      permissions: ['microphone', 'camera'],
    });
    await use(context);
    await context.close();
  },

  hostPage: async ({ hostContext }, use) => {
    const page = await hostContext.newPage();
    await use(page);
  },

  guestPage: async ({ guestContext }, use) => {
    const page = await guestContext.newPage();
    await use(page);
  },

  hostNav: async ({ hostPage }, use) => {
    await use(new NavigationPage(hostPage));
  },

  hostClass: async ({ hostPage }, use) => {
    await use(new EmergencyClassPage(hostPage));
  },
});
