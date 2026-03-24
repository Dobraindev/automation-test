import { test, expect } from '@playwright/test';
import { MeetPage } from '../../src/pages/MeetPage.js';
import { env } from '../../src/config/env.js';
import { generateRoomName } from '../../src/config/test-data.js';

test.describe('Host - Create Room', () => {
  test.use({ storageState: 'auth/host.json' });

  let meetPage: MeetPage;

  test.beforeEach(async ({ page }) => {
    meetPage = new MeetPage(page, env.hostCredentials.userId);
    await meetPage.goto();
  });

  test('should display meet page with room input @smoke', async () => {
    await expect(meetPage['page'].locator('#roomNameInput')).toBeVisible();
  });

  test('should create a room and navigate to session', async ({ page }) => {
    const roomName = generateRoomName();
    await meetPage.createRoom(roomName);
    // 방 생성 후 세션 페이지로 이동
    await expect(page).toHaveURL(new RegExp(`/meet/${roomName}`));
  });

  test('should show validation error for invalid room name', async ({ page }) => {
    // 한글 입력 시 에러 (영문/숫자만 허용)
    await page.fill('#roomNameInput', '한글방이름');
    const inputError = page.locator('.inputError');
    // input에 에러 스타일이 적용되거나 버튼이 비활성화
    const button = page.locator('button:has-text("수업 시작")');
    await expect(button).toBeDisabled();
  });
});
