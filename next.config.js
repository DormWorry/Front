/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // 빌드 시 ESLint 검사를 비활성화합니다
    ignoreDuringBuilds: true,
  },
  // 타입스크립트 타입 검사 비활성화
  typescript: {
    ignoreBuildErrors: true,
  },
  // 오직 tsx, jsx 파일만 페이지로 간주
  pageExtensions: ['tsx', 'jsx'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://port-0-capstoneserver-m6xxoqjg3249c6c2.sel4.cloudtype.app/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'https://port-0-capstoneserver-m6xxoqjg3249c6c2.sel4.cloudtype.app/auth/:path*',
      },
      // 카카오 토큰은 이제 API Routes를 사용하므로 여기서는 제거
      // 다른 필요한 프록시 경로를 여기에 추가할 수 있습니다
    ];
  },
};

module.exports = nextConfig;
