import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'https://ppistaging.dubuhealth.in';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: {
    timeout: 15000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    storageState: 'auth/user.json',
  },
  projects: [
    // ── 공통 setup ──
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { storageState: undefined },
    },

    // ── E2E 테스트 (최종 목표) ──
    {
      name: 'e2e',
      testDir: './tests/e2e',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        permissions: ['microphone', 'camera'],
        launchOptions: {
          args: [
            '--use-fake-device-for-media-stream',
            '--use-fake-ui-for-media-stream',
          ],
        },
      },
    },

    // ── Edge Case 테스트 ──
    {
      name: 'edge-cases',
      testDir: './tests/edge-cases',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        permissions: ['microphone', 'camera'],
        launchOptions: {
          args: [
            '--use-fake-device-for-media-stream',
            '--use-fake-ui-for-media-stream',
          ],
        },
      },
    },

    // ── 배포전TC (기존 테스트 보관) ──
    {
      name: '배포전TC-navigation',
      testDir: './tests/배포전TC/navigation',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '배포전TC-pages',
      testDir: './tests/배포전TC/pages',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '배포전TC-session',
      testDir: './tests/배포전TC/session',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '배포전TC-collaboration',
      testDir: './tests/배포전TC/collaboration',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        permissions: ['microphone', 'camera'],
        launchOptions: {
          args: [
            '--use-fake-device-for-media-stream',
            '--use-fake-ui-for-media-stream',
          ],
        },
      },
    },

    // ── 호스트 중복 접속 제어 (매일 검증) ──
    {
      name: '배포전TC-access-control',
      testDir: './tests/배포전TC/access-control',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        permissions: ['microphone', 'camera'],
        launchOptions: {
          args: [
            '--use-fake-device-for-media-stream',
            '--use-fake-ui-for-media-stream',
          ],
        },
      },
    },
  ],
});
