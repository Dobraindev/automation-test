/**
 * CSS Selectors - dubu-pingpong 소스코드 기반 실제 셀렉터
 */
export const SELECTORS = {
  // 로그인 (app/page.tsx)
  login: {
    form: 'form',
    userIdInput: 'input[type="text"][placeholder="사용자 ID를 입력하세요"]',
    accessTokenInput: 'input[type="password"][placeholder="액세스 토큰을 입력하세요"]',
    submitButton: 'button[type="submit"]',
    errorMessage: '.errorMessage',
  },

  // Meet 페이지 - 방 생성 (components/pages/meet.tsx)
  meet: {
    roomNameInput: '#roomNameInput',
    createRoomButton: 'button:has-text("수업 시작")',
    recentRoomNames: '.recentRoomNames',
    recentRoomButton: '.recentRoomNameBtn',
    removeRoomButton: '.removeRoomNameBtn',
    roomsList: '.roomsList',
    roomItem: '.roomItem',
    deleteRoomButton: '.deleteRoomBtn',
    // 디바이스 선택
    deviceRow: '.globalDeviceRow',
    deviceBox: '.globalDeviceBox',
    deviceSelect: '.globalDeviceSelect',
  },

  // 게스트 입장 (components/pages/guest-entry.tsx)
  guestEntry: {
    container: '.container',
    enterButton: 'button:has-text("입장하기")',
    waitingBox: '.waitingBox',
    deniedBox: '.deniedBox',
    deviceRow: '.globalDeviceRow',
    deviceSelect: '.globalDeviceSelect',
    errorMessage: '.globalErrorMsg',
  },

  // 호스트 세션 (components/pages/host.tsx)
  hostSession: {
    layoutContainer: '.layoutContainer',
    // 게스트 승인 팝업
    approvalOverlay: '.centerPopupOverlay',
    approvalContent: '.centerPopupContent',
    approvalText: '.centerPopupText',
    approveButton: '.centerApprove',
    denyButton: '.centerDeny',
    // 영상 영역
    screenArea: '.screenArea',
    avatarArea: '.avatarArea',
    // 채팅
    floatingChat: '.floatingChat',
  },

  // 게스트 세션 (components/pages/guest.tsx)
  guestSession: {
    meetContainer: '.meetContainer',
    therapistArea: '.therapistAiArea',
    childArea: '.childArea',
    // 버튼
    buttonArea: '.buttonArea',
    micButton: '.micButton',
    exitButton: '.exitButton',
    exitText: '.exitText',
    // 상태
    connectionStatus: '.connectionStatus',
    statusIndicator: '.statusIndicator',
    retryButton: 'button:has-text("다시 시도")',
    // 로딩
    loadingContainer: '.loadingContainer',
  },
} as const;

/**
 * Timeouts
 */
export const TIMEOUTS = {
  short: 5000,
  medium: 15000,
  long: 30000,
  navigation: 30000,
  websocket: 10000,
  deviceReady: 10000,
} as const;

/**
 * Routes - dubu-pingpong 라우트 구조
 */
export const ROUTES = {
  home: '/',
  // 호스트(치료사)
  hostMain: (userId: string) => `/app/main/${userId}`,
  hostMeet: (userId: string) => `/app/main/${userId}/meet`,
  hostMeetRoom: (userId: string, roomId: string) => `/app/main/${userId}/meet/${roomId}`,
  hostActivity: (userId: string) => `/app/main/${userId}/activity`,
  hostLog: (userId: string) => `/app/main/${userId}/log`,
  hostPreset: (userId: string) => `/app/main/${userId}/preset`,
  hostSet: (userId: string) => `/app/main/${userId}/set`,
  hostStats: (userId: string) => `/app/main/${userId}/stats`,
  // 게스트(아동)
  guestRoom: (roomId: string) => `/app/guest/${roomId}`,
  // AI 시연
  present: (userId: string, profileId: string) => `/app/present/${userId}/${profileId}`,
} as const;
