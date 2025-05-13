/**
 * API 접속 설정을 위한 공통 구성 파일
 * 모든 API URL은 이 파일에서 관리합니다.
 */

// CloudType 백엔드 서버 URL
export const API_BASE_URL = 'https://port-0-capstoneserver-m6xxoqjg3249c6c2.sel4.cloudtype.app';

// 소켓 URL (채팅 등)
export const SOCKET_URL = 'https://port-0-capstoneserver-m6xxoqjg3249c6c2.sel4.cloudtype.app';

// 프론트엔드 URL
export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://capstone-front-nu.vercel.app';

// 카카오 클라이언트 ID (환경 변수에서 가져옴)
export const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '2d1c91f77fd7c8c32c3d7d8083a26fd2';

// API 요청 타임아웃 (밀리초)
export const API_TIMEOUT = 10000;

// 기본 헤더 설정
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// 개발 환경에서만 사용할 테스트 토큰
export const TEST_TOKEN = 'test_token_for_development_only_12345';
