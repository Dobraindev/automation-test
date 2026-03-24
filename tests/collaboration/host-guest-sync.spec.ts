import { expect } from '@playwright/test';
import { collaborationTest } from '../../src/fixtures/collaboration.fixture.js';
import { GuestSessionPage } from '../../src/pages/GuestSessionPage.js';
import { generateRoomName } from '../../src/config/test-data.js';

collaborationTest.describe('Host-Guest Session', () => {
  collaborationTest.describe.configure({ mode: 'serial' });

  /**
   * 공통 셋업: 호스트 방 생성 → 게스트 입장 → 승인
   */
  async function setupSession(
    fixtures: {
      hostPage: import('@playwright/test').Page;
      guestPage: import('@playwright/test').Page;
      meetPage: import('../../src/pages/MeetPage.js').MeetPage;
      guestEntry: import('../../src/pages/GuestEntryPage.js').GuestEntryPage;
      hostSession: import('../../src/pages/HostSessionPage.js').HostSessionPage;
    }
  ) {
    const { hostPage, meetPage, guestEntry, hostSession } = fixtures;
    await meetPage.goto();
    const roomName = generateRoomName();
    await meetPage.createRoom(roomName);
    await hostPage.waitForURL(new RegExp(`/meet/${roomName}`));

    const guestUrl = `${hostPage.url().split('/app/')[0]}/app/guest/${roomName}`;
    await guestEntry.enterRoom(guestUrl);
    await hostSession.approveGuest();
    await guestEntry.waitForAdmission();

    return { roomName, guestUrl };
  }

  collaborationTest(
    'should establish host-guest session @smoke',
    async (fixtures) => {
      await setupSession(fixtures);

      // 호스트 세션 페이지 로드 확인
      await fixtures.hostSession.waitForReady();

      // 게스트 세션 페이지 로드 확인
      const guestSession = new GuestSessionPage(fixtures.guestPage);
      await guestSession.waitForReady();
    }
  );

  collaborationTest(
    'should show therapist area on guest side',
    async (fixtures) => {
      await setupSession(fixtures);

      const guestSession = new GuestSessionPage(fixtures.guestPage);
      await guestSession.waitForTherapistArea();

      // 아바타/치료사 영역이 보이는지 확인
      await expect(fixtures.guestPage.locator('.therapistAiArea')).toBeVisible();
    }
  );

  collaborationTest(
    'should allow guest to toggle microphone',
    async (fixtures) => {
      await setupSession(fixtures);

      const guestSession = new GuestSessionPage(fixtures.guestPage);
      await guestSession.waitForReady();

      // 마이크 토글 테스트
      const micButton = fixtures.guestPage.locator('.micButton');
      await expect(micButton).toBeVisible();
      await guestSession.toggleMic();
    }
  );

  collaborationTest(
    'should allow guest to exit session',
    async (fixtures) => {
      await setupSession(fixtures);

      const guestSession = new GuestSessionPage(fixtures.guestPage);
      await guestSession.waitForReady();

      // 나가기 버튼 클릭
      await guestSession.exit();
    }
  );
});
