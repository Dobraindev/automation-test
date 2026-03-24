import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { env } from '../config/env.js';

/**
 * 로그인 후 storageState 저장
 */
export async function setupAuth(page: import('@playwright/test').Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(env.credentials.name, env.credentials.password);
  await page.waitForURL(/\/main/, { timeout: 15000 });
  await page.context().storageState({ path: 'auth/user.json' });
}

/**
 * 인증된 상태의 테스트 fixture
 */
export const authenticatedTest = base.extend<{
  loginPage: LoginPage;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
