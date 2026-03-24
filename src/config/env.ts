import type { TestEnvironment } from '../types/index.js';

export function getEnvironment(): TestEnvironment {
  return {
    baseUrl: process.env.BASE_URL || 'https://ppistaging.dubuhealth.in',
    hostCredentials: {
      userId: process.env.HOST_USER_ID || '',
      accessToken: process.env.HOST_ACCESS_TOKEN || '',
    },
    guestCredentials: {
      userId: process.env.GUEST_USER_ID || '',
      accessToken: process.env.GUEST_ACCESS_TOKEN || '',
    },
    timeout: Number(process.env.TEST_TIMEOUT) || 60000,
    headless: process.env.HEADLESS !== 'false',
  };
}

export const env = getEnvironment();
