import type { BrowserContext, Page } from '@playwright/test';

export interface CollaborationSession {
  hostContext: BrowserContext;
  guestContext: BrowserContext;
  hostPage: Page;
  guestPage: Page;
  cleanup: () => Promise<void>;
}

export interface UserCredentials {
  userId: string;
  accessToken: string;
}

export interface TestEnvironment {
  baseUrl: string;
  hostCredentials: UserCredentials;
  guestCredentials: UserCredentials;
  timeout: number;
  headless: boolean;
}

export interface RoomInfo {
  roomName: string;
  guestUrl: string;
  hostUserId: string;
}
