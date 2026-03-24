import { expect } from '@playwright/test';
import { collaborationTest } from '../../src/fixtures/collaboration.fixture.js';
import { generateRoomName } from '../../src/config/test-data.js';

collaborationTest.describe('Guest - Join Room', () => {
  collaborationTest(
    'should display guest entry page with enter button @smoke',
    async ({ hostPage, guestPage, meetPage, guestEntry }) => {
      // 호스트: 방 생성
      await meetPage.goto();
      const roomName = generateRoomName();
      await meetPage.createRoom(roomName);
      await hostPage.waitForURL(new RegExp(`/meet/${roomName}`));

      // 게스트: 방 입장 페이지로 이동
      const guestUrl = `${hostPage.url().split('/app/')[0]}/app/guest/${roomName}`;
      await guestEntry.navigateToRoom(guestUrl);
      await guestEntry.waitForReady();

      // 입장하기 버튼 표시 확인
      await expect(guestPage.locator('button:has-text("입장하기")')).toBeVisible();
    }
  );

  collaborationTest(
    'should show waiting state after clicking enter',
    async ({ hostPage, guestPage, meetPage, guestEntry }) => {
      await meetPage.goto();
      const roomName = generateRoomName();
      await meetPage.createRoom(roomName);
      await hostPage.waitForURL(new RegExp(`/meet/${roomName}`));

      const guestUrl = `${hostPage.url().split('/app/')[0]}/app/guest/${roomName}`;
      await guestEntry.enterRoom(guestUrl);

      // 대기 상태 표시
      const isWaiting = await guestEntry.isWaiting();
      expect(isWaiting).toBe(true);
    }
  );

  collaborationTest(
    'should be admitted when host approves',
    async ({ hostPage, guestPage, meetPage, guestEntry, hostSession }) => {
      await meetPage.goto();
      const roomName = generateRoomName();
      await meetPage.createRoom(roomName);
      await hostPage.waitForURL(new RegExp(`/meet/${roomName}`));

      const guestUrl = `${hostPage.url().split('/app/')[0]}/app/guest/${roomName}`;
      await guestEntry.enterRoom(guestUrl);

      // 호스트: 승인
      await hostSession.approveGuest();

      // 게스트: 대기 상태 해제 → 세션 진입
      await guestEntry.waitForAdmission();
    }
  );

  collaborationTest(
    'should show denied state when host denies',
    async ({ hostPage, guestPage, meetPage, guestEntry, hostSession }) => {
      await meetPage.goto();
      const roomName = generateRoomName();
      await meetPage.createRoom(roomName);
      await hostPage.waitForURL(new RegExp(`/meet/${roomName}`));

      const guestUrl = `${hostPage.url().split('/app/')[0]}/app/guest/${roomName}`;
      await guestEntry.enterRoom(guestUrl);

      // 호스트: 거부
      await hostSession.denyGuest();

      // 게스트: 거부 상태 표시
      await expect(guestPage.locator('.deniedBox')).toBeVisible({ timeout: 10000 });
    }
  );
});
