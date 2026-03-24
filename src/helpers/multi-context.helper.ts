import type { Browser, BrowserContext, Page } from '@playwright/test';
import type { CollaborationSession } from '../types/index.js';

interface ContextOptions {
  storageState?: string;
  permissions?: string[];
}

const DEFAULT_PERMISSIONS = ['microphone', 'camera'];

/**
 * 호스트/게스트 독립 컨텍스트 세션 생성
 * browser.newContext()를 사용하여 쿠키/스토리지 완전 분리
 */
export async function createCollaborationSession(
  browser: Browser,
  options?: {
    host?: ContextOptions;
    guest?: ContextOptions;
  }
): Promise<CollaborationSession> {
  const hostContext = await browser.newContext({
    permissions: options?.host?.permissions ?? DEFAULT_PERMISSIONS,
    storageState: options?.host?.storageState,
  });
  const guestContext = await browser.newContext({
    permissions: options?.guest?.permissions ?? DEFAULT_PERMISSIONS,
    storageState: options?.guest?.storageState,
  });

  const hostPage = await hostContext.newPage();
  const guestPage = await guestContext.newPage();

  return {
    hostContext,
    guestContext,
    hostPage,
    guestPage,
    cleanup: async () => {
      await hostContext.close();
      await guestContext.close();
    },
  };
}

/**
 * N명의 참가자가 필요한 시나리오용
 */
export async function createMultiParticipantSession(
  browser: Browser,
  count: number,
  options?: ContextOptions
): Promise<{ contexts: BrowserContext[]; pages: Page[]; cleanup: () => Promise<void> }> {
  const contexts: BrowserContext[] = [];
  const pages: Page[] = [];

  for (let i = 0; i < count; i++) {
    const ctx = await browser.newContext({
      permissions: options?.permissions ?? DEFAULT_PERMISSIONS,
      storageState: options?.storageState,
    });
    contexts.push(ctx);
    pages.push(await ctx.newPage());
  }

  return {
    contexts,
    pages,
    cleanup: async () => {
      for (const ctx of contexts) {
        await ctx.close();
      }
    },
  };
}
