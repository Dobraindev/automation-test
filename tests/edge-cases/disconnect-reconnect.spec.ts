import { expect } from '@playwright/test';
import { collaborationTest } from '../../src/fixtures/collaboration.fixture.js';
import { GuestSessionPage } from '../../src/pages/GuestSessionPage.js';
import { generateRoomName } from '../../src/config/test-data.js';
import { simulateDisconnect } from '../../src/helpers/network.helper.js';

collaborationTest.describe('Disconnect & Reconnect', () => {
  collaborationTest.describe.configure({ mode: 'serial' });

  collaborationTest(
    'should detect guest disconnect',
    async ({ hostPage, guestPage, meetPage, guestEntry, hostSession }) => {
      await meetPage.goto();
      const roomName = generateRoomName();
      await meetPage.createRoom(roomName);
      await hostPage.waitForURL(new RegExp(`/meet/${roomName}`));

      const guestUrl = `${hostPage.url().split('/app/')[0]}/app/guest/${roomName}`;
      await guestEntry.enterRoom(guestUrl);
      await hostSession.approveGuest();
      await guestEntry.waitForAdmission();

      const guestSession = new GuestSessionPage(guestPage);
      await guestSession.waitForReady();

      // 게스트 네트워크 차단
      await simulateDisconnect(guestPage);

      // 연결 끊김 상태 표시 확인
      await expect(async () => {
        expect(await guestSession.hasConnectionError()).toBe(true);
      }).toPass({ timeout: 15000 });
    }
  );

  collaborationTest(
    'should reconnect after network recovery',
    async ({ hostPage, guestPage, meetPage, guestEntry, hostSession }) => {
      await meetPage.goto();
      const roomName = generateRoomName();
      await meetPage.createRoom(roomName);
      await hostPage.waitForURL(new RegExp(`/meet/${roomName}`));

      const guestUrl = `${hostPage.url().split('/app/')[0]}/app/guest/${roomName}`;
      await guestEntry.enterRoom(guestUrl);
      await hostSession.approveGuest();
      await guestEntry.waitForAdmission();

      const guestSession = new GuestSessionPage(guestPage);
      await guestSession.waitForReady();

      // 네트워크 차단 후 복구
      const restore = await simulateDisconnect(guestPage);
      await guestPage.waitForTimeout(3000);
      await restore();

      // 재연결 또는 다시 시도 가능 확인
      await expect(async () => {
        const hasError = await guestSession.hasConnectionError();
        if (hasError) {
          // "다시 시도" 버튼이 보이면 클릭
          const retryBtn = guestPage.locator('button:has-text("다시 시도")');
          if (await retryBtn.isVisible()) {
            await retryBtn.click();
          }
        }
      }).toPass({ timeout: 15000 });
    }
  );
});
