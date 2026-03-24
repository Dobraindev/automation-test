import type { TestEnvironment } from '../types/index.js';

export function getEnvironment(): TestEnvironment {
  return {
    baseUrl: process.env.BASE_URL || 'https://ppistaging.dubuhealth.in',
    credentials: {
      name: process.env.USER_NAME || '',
      password: process.env.USER_PASSWORD || '',
    },
    timeout: Number(process.env.TEST_TIMEOUT) || 60000,
    headless: process.env.HEADLESS !== 'false',
  };
}

export const env = getEnvironment();
