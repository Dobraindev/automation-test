import { expect } from '@playwright/test';
import { collaborationTest } from '../../src/fixtures/collaboration.fixture.js';
import { GuestSessionPage } from '../../src/pages/GuestSessionPage.js';
import { generateRoomName } from '../../src/config/test-data.js';
import { simulateSlowNetwork } from '../../src/helpers/network.helper.js';

collaborationTest.describe('Network Throttle', () => {
  collaborationTest.describe.configure({ mode: 'serial' });

  collaborationTest(
    'should handle slow network gracefully',
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

      // 1초 네트워크 지연 적용
      const restore = await simulateSlowNetwork(guestPage, 1000);

      // 느린 네트워크에서도 UI가 정상 표시되는지 확인
      await expect(guestPage.locator('.meetContainer')).toBeVisible();

      await restore();
    }
  );
});
