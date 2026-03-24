import { env } from './env.js';

/**
 * 테스트 실행마다 고유한 방 이름 생성 (영문/숫자만 허용)
 */
export function generateRoomName(prefix = 'test'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}${timestamp}${random}`;
}

/**
 * 테스트 계정 정보
 */
export const testAccounts = {
  host: env.hostCredentials,
  guest: env.guestCredentials,
} as const;
