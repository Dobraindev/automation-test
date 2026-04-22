import type { BrowserContext, Page } from '@playwright/test';

export interface CollaborationSession {
  hostContext: BrowserContext;
  guestContext: BrowserContext;
  hostPage: Page;
  guestPage: Page;
  cleanup: () => Promise<void>;
}

export interface UserCredentials {
  name: string;
  password: string;
}

export interface TestEnvironment {
  baseUrl: string;
  credentials: UserCredentials;
  credentialsB?: UserCredentials;
  timeout: number;
  headless: boolean;
}
