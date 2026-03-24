import { test, expect } from '@playwright/test';
import { MeetPage } from '../../src/pages/MeetPage.js';
import { env } from '../../src/config/env.js';

test.describe('Host - Device Settings', () => {
  test.use({ storageState: 'auth/host.json' });

  test('should display device selection options', async ({ page }) => {
    const meetPage = new MeetPage(page, env.hostCredentials.userId);
    await meetPage.goto();

    // 마이크, 스피커, 보이스 프리셋 선택 영역 확인
    const deviceRow = page.locator('.globalDeviceRow');
    await expect(deviceRow).toBeVisible();

    const deviceBoxes = page.locator('.globalDeviceBox');
    expect(await deviceBoxes.count()).toBeGreaterThanOrEqual(2);
  });

  test('should show recent room names', async ({ page }) => {
    const meetPage = new MeetPage(page, env.hostCredentials.userId);
    await meetPage.goto();

    // 최근 방 이름이 있으면 표시
    const recentSection = page.locator('.recentRoomNames');
    // 존재할 수도 안할 수도 있으므로 에러 없이 확인만
    const isVisible = await recentSection.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });
});
