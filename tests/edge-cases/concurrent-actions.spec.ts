import { expect } from '@playwright/test';
import { collaborationTest } from '../../src/fixtures/collaboration.fixture.js';
import { GuestSessionPage } from '../../src/pages/GuestSessionPage.js';
import { GuestEntryPage } from '../../src/pages/GuestEntryPage.js';
import { generateRoomName } from '../../src/config/test-data.js';

collaborationTest.describe('Concurrent Actions', () => {
  collaborationTest.describe.configure({ mode: 'serial' });

  collaborationTest(
    'should handle multiple guests trying to join simultaneously',
    async ({ browser, hostPage, meetPage, hostSession }) => {
      await meetPage.goto();
      const roomName = generateRoomName();
      await meetPage.createRoom(roomName);
      await hostPage.waitForURL(new RegExp(`/meet/${roomName}`));

      const guestUrl = `${hostPage.url().split('/app/')[0]}/app/guest/${roomName}`;

      // 두 명의 게스트가 동시에 입장 시도
      const guest1Context = await browser.newContext({ permissions: ['microphone', 'camera'] });
      const guest2Context = await browser.newContext({ permissions: ['microphone', 'camera'] });
      const guest1Page = await guest1Context.newPage();
      const guest2Page = await guest2Context.newPage();

      const guest1Entry = new GuestEntryPage(guest1Page);
      const guest2Entry = new GuestEntryPage(guest2Page);

      await Promise.all([
        guest1Entry.enterRoom(guestUrl),
        guest2Entry.enterRoom(guestUrl),
      ]);

      // 호스트 측에서 승인 팝업이 나타남
      await hostSession.approveGuest();

      // 정리
      await guest1Context.close();
      await guest2Context.close();
    }
  );
});
