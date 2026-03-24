/**
 * 실제 스테이징 사이트 (ppistaging.dubuhealth.in) 기반 셀렉터
 * 브라우저 탐색으로 직접 확인한 UI 구조
 */

/**
 * 네비게이션 라우트
 */
export const ROUTES = {
  home: '/',
  classMgmt: '/main/class-mgmt',
  schedule: '/main/schedule',
  monitorDashboard: '/monitor-dashboard',
  user: '/main/user',
  activity: '/main/activity',
  message: '/main/message',
  resource: '/main/res',
  avatar: '/main/avatars',
  activityTemplate: '/main/activity-template',
  lessonTemplate: '/main/lesson-template',
  curriculum: '/main/curriculum',
  promptVariable: '/main/prompt-variable',
  log: '/main/log',
  promptTest: '/main/prompt-test',
  emergencyClass: '/main',
  member: '/main/member',
} as const;

/**
 * 네비게이션 링크 텍스트
 */
export const NAV_ITEMS = [
  '수업 일정',
  '진행자 근무 관리',
  '모니터 대시보드',
  '사용자',
  '활동',
  '메시지',
  '리소스',
  '아바타',
  '활동 템플릿',
  '회기 템플릿',
  '커리큘럼',
  '프롬프트 변수',
  '로그',
  '테스트',
  '(비상용) 수업',
  '권한 관리',
] as const;

/**
 * 페이지별 셀렉터
 */
export const SELECTORS = {
  // 로그인 페이지 (/)
  login: {
    nameInput: 'input[placeholder="이름을 입력하세요"]',
    passwordInput: 'input[placeholder="비밀번호를 입력하세요"]',
    submitButton: 'button:has-text("로그인")',
  },

  // 공통 네비게이션
  nav: {
    logo: 'a[href="/main/class-mgmt"]',
    adminUser: 'button:has-text("관리자")',
  },

  // 수업 일정 관리 (/main/class-mgmt)
  classMgmt: {
    todayTab: 'button:has-text("오늘 수업")',
    allTab: 'button:has-text("전체 수업")',
    stopTab: 'button:has-text("중단 관리")',
    searchInput: 'input[placeholder="아동 검색"]',
    searchButton: 'button:has-text("검색")',
    todayButton: 'button:has-text("오늘")',
    deleteButton: 'button:has-text("삭제")',
    addClassButton: 'button:has-text("수업 추가")',
  },

  // 진행자 근무 관리 (/main/schedule)
  schedule: {
    fixedTab: 'button:has-text("고정 시간표 관리")',
    tempTab: 'button:has-text("임시 휴무 관리")',
    facilitatorSelect: 'select',
  },

  // 모니터 대시보드 (/monitor-dashboard)
  monitor: {
    testPageCopyButton: 'button:has-text("테스트 페이지 주소 복사")',
  },

  // 사용자 관리 (/main/user)
  user: {
    searchInput: 'input[placeholder*="사용자"]',
    addUserButton: 'button:has-text("새 사용자 추가")',
    userTable: 'table',
  },

  // 활동 (/main/activity)
  activityPage: {
    newSessionButton: 'button:has-text("새 회기 생성")',
    editSessionButton: 'button:has-text("회기 수정")',
    newActivityButton: 'button:has-text("새 활동 생성")',
    userSelect: 'select',
  },

  // 메시지 (/main/message)
  messagePage: {
    messageInput: 'input[placeholder*="메시지를 입력"]',
    createButton: 'button:has-text("생성")',
    addRuleButton: 'button:has-text("알림 규칙 추가")',
    addTemplateButton: 'button:has-text("템플릿 추가")',
  },

  // 리소스 (/main/res)
  resource: {
    uploadArea: 'text=클릭하거나 파일을 드래그하여 업로드',
    searchInput: 'input[placeholder*="파일명 검색"]',
    resourceTable: 'table',
  },

  // 아바타 (/main/avatars)
  avatar: {
    addButton: 'button:has-text("새 아바타 추가")',
    avatarTable: 'table',
  },

  // 활동 템플릿 (/main/activity-template)
  activityTemplate: {
    createButton: 'button:has-text("새 템플릿 생성")',
    templateTable: 'table',
  },

  // 회기 템플릿 (/main/lesson-template)
  lessonTemplate: {
    selectDropdown: 'select',
    editButton: 'button:has-text("회기 템플릿 수정")',
    createButton: 'button:has-text("새 회기 템플릿 생성")',
  },

  // 커리큘럼 (/main/curriculum)
  curriculum: {
    searchInput: 'input[placeholder*="커리큘럼 검색"]',
    listButton: 'button:has-text("목록")',
    calendarButton: 'button:has-text("캘린")',
    createButton: 'button:has-text("새 커리큘럼")',
  },

  // 프롬프트 변수 (/main/prompt-variable)
  promptVariable: {
    tagSearch: 'input[placeholder*="태그로 검색"]',
    addButton: 'button:has-text("변수 추가")',
  },

  // 로그 (/main/log)
  log: {
    userSelect: 'select >> nth=0',
    sessionSelect: 'select >> nth=1',
    searchButton: 'button:has-text("조회")',
    copyButton: 'button:has-text("복사")',
  },

  // 테스트 (/main/prompt-test)
  promptTest: {
    userSelect: 'select >> nth=0',
    sessionSelect: 'select >> nth=1',
    v10Button: 'button:has-text("V1.0")',
    v15Button: 'button:has-text("V1.5")',
    settingsButton: 'button:has-text("Settings")',
    chatInput: 'input[placeholder*="채팅 메시지를 입력"]',
  },

  // (비상용) 수업 (/main) - 호스트/게스트 세션 생성
  emergencyClass: {
    childSelect: 'select >> nth=0',
    sessionSelect: 'select >> nth=1',
    deviceSelect: 'select >> nth=2',
    startButton: 'button:has-text("수업 시작")',
    roomList: 'text=현재 생성된 방 목록',
  },

  // 권한 관리 (/main/member)
  member: {
    addMemberButton: 'button:has-text("새 멤버 추가")',
    memberTable: 'table',
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
} as const;
