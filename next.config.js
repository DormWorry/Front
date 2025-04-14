/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['gsap'],
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
    ]
  },
}

module.exports = nextConfig
