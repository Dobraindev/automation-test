import { env } from './env.js';

export const testAccount = env.credentials;

/**
 * 테스트용 고유 이름 생성
 */
export function generateUniqueName(prefix = 'test'): string {
  const timestamp = Date.now().toString(36);
  return `${prefix}_${timestamp}`;
}
