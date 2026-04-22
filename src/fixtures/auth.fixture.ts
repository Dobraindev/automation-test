import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { env } from '../config/env.js';

/**
 * 로그인 후 storageState 저장 (Host A)
 */
export async function setupAuth(page: import('@playwright/test').Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(env.credentials.name, env.credentials.password);
  await page.waitForURL(/\/main/, { timeout: 15000 });
  await page.context().storageState({ path: 'auth/user.json' });
}

/**
 * 로그인 후 storageState 저장 (Host B - 호스트 중복 접속 검증용)
 */
export async function setupAuthB(page: import('@playwright/test').Page): Promise<void> {
  if (!env.credentialsB) throw new Error('USER_B_NAME/USER_B_PASSWORD 환경 변수 미설정');
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(env.credentialsB.name, env.credentialsB.password);
  await page.waitForURL(/\/main/, { timeout: 15000 });
  await page.context().storageState({ path: 'auth/user-b.json' });
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
