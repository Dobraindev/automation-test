import { test as base, type Page, type BrowserContext } from '@playwright/test';
import { MeetPage } from '../pages/MeetPage.js';
import { HostSessionPage } from '../pages/HostSessionPage.js';
import { GuestEntryPage } from '../pages/GuestEntryPage.js';
import { GuestSessionPage } from '../pages/GuestSessionPage.js';
import { env } from '../config/env.js';

type CollaborationFixtures = {
  hostPage: Page;
  guestPage: Page;
  hostContext: BrowserContext;
  guestContext: BrowserContext;
  meetPage: MeetPage;
  hostSession: HostSessionPage;
  guestEntry: GuestEntryPage;
  guestSession: GuestSessionPage;
};

/**
 * 호스트/게스트 듀얼 컨텍스트 테스트 fixture
 * browser.newContext()로 완전 분리된 세션 생성
 */
export const collaborationTest = base.extend<CollaborationFixtures>({
  hostContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'auth/host.json',
      permissions: ['microphone', 'camera'],
    });
    await use(context);
    await context.close();
  },

  guestContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'auth/guest.json',
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

  meetPage: async ({ hostPage }, use) => {
    await use(new MeetPage(hostPage, env.hostCredentials.userId));
  },

  hostSession: async ({ hostPage }, use) => {
    await use(new HostSessionPage(hostPage));
  },

  guestEntry: async ({ guestPage }, use) => {
    await use(new GuestEntryPage(guestPage));
  },

  guestSession: async ({ guestPage }, use) => {
    await use(new GuestSessionPage(guestPage));
  },
});
