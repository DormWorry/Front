/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // 빌드 시 ESLint 검사를 비활성화합니다
    ignoreDuringBuilds: true,
  },
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
