import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { env } from '../config/env.js';

/**
 * 인증된 상태의 테스트 fixture
 */
export const authenticatedTest = base.extend<{
  loginPage: LoginPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

/**
 * Host(치료사) 계정으로 로그인하여 storageState 저장
 */
export async function setupHostAuth(page: import('@playwright/test').Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(env.hostCredentials.userId, env.hostCredentials.accessToken);
  await page.waitForURL('**/main/**');
  await page.context().storageState({ path: 'auth/host.json' });
}

/**
 * Guest(아동)는 별도 로그인 없이 방 링크로 접근
 * 게스트 계정이 있는 경우에만 storageState 저장
 */
export async function setupGuestAuth(page: import('@playwright/test').Page): Promise<void> {
  if (env.guestCredentials.userId && env.guestCredentials.accessToken) {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(env.guestCredentials.userId, env.guestCredentials.accessToken);
    await page.waitForURL('**/main/**');
  }
  await page.context().storageState({ path: 'auth/guest.json' });
}
