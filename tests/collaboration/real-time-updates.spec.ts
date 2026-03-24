import { expect } from '@playwright/test';
import { collaborationTest } from '../../src/fixtures/collaboration.fixture.js';
import { GuestSessionPage } from '../../src/pages/GuestSessionPage.js';
import { generateRoomName } from '../../src/config/test-data.js';

collaborationTest.describe('Real-time Session Updates', () => {
  collaborationTest.describe.configure({ mode: 'serial' });

  collaborationTest(
    'should maintain connection between host and guest',
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

      // 연결 오류가 없어야 함
      const hasError = await guestSession.hasConnectionError();
      expect(hasError).toBe(false);
    }
  );

  collaborationTest(
    'should show guest video area in session',
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

      // 게스트 비디오 영역 확인
      const childAreaVisible = await guestSession.isChildAreaVisible();
      expect(childAreaVisible).toBe(true);
    }
  );
});
