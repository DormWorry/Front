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
        destination: 'https://www.dormworry.p-e.kr/api/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'https://www.dormworry.p-e.kr/auth/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
