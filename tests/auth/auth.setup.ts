import { test as setup } from '@playwright/test';
import { setupAuth, setupAuthB } from '../../src/fixtures/auth.fixture.js';
import { env } from '../../src/config/env.js';

setup('authenticate user', async ({ page }) => {
  await setupAuth(page);
});

setup('authenticate user B', async ({ page }) => {
  if (!env.credentialsB) {
    setup.skip();
    return;
  }
  await setupAuthB(page);
});
