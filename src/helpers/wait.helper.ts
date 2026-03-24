import type { Page } from '@playwright/test';
import { TIMEOUTS } from '../config/constants.js';

/**
 * 조건이 참이 될 때까지 폴링
 */
export async function waitForCondition(
  condition: () => Promise<boolean>,
  options?: { timeout?: number; interval?: number }
): Promise<void> {
  const timeout = options?.timeout ?? TIMEOUTS.medium;
  const interval = options?.interval ?? 500;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await condition()) return;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * WebSocket 연결이 활성화될 때까지 대기
 */
export async function waitForWebSocket(page: Page, urlPattern?: string): Promise<void> {
  await page.waitForEvent('websocket', {
    predicate: (ws) => (urlPattern ? ws.url().includes(urlPattern) : true),
    timeout: TIMEOUTS.websocket,
  });
}
