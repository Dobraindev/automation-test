import type { Page, Route } from '@playwright/test';

/**
 * WebSocket 연결을 차단하여 연결 끊김 시뮬레이션
 */
export async function simulateDisconnect(page: Page): Promise<() => Promise<void>> {
  await page.route('**/*', (route: Route) => {
    if (route.request().url().includes('ws://') || route.request().url().includes('wss://')) {
      route.abort();
    } else {
      route.continue();
    }
  });

  // 연결 복구 함수 반환
  return async () => {
    await page.unroute('**/*');
  };
}

/**
 * 네트워크 지연 시뮬레이션
 */
export async function simulateSlowNetwork(page: Page, delayMs: number): Promise<() => Promise<void>> {
  await page.route('**/*', async (route: Route) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    await route.continue();
  });

  return async () => {
    await page.unroute('**/*');
  };
}

/**
 * 특정 API 요청을 모킹
 */
export async function mockApiResponse(
  page: Page,
  urlPattern: string,
  response: { status?: number; body?: unknown }
): Promise<void> {
  await page.route(urlPattern, (route: Route) => {
    route.fulfill({
      status: response.status ?? 200,
      contentType: 'application/json',
      body: JSON.stringify(response.body ?? {}),
    });
  });
}
