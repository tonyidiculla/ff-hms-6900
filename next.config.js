/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xnetjsifkhtbbpadwlxy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async rewrites() {
    return [
      // Only keep API gateway routes for backend communication
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:6800/api/auth/:path*',
      },
      {
        source: '/api/outpatient/:path*',
        destination: 'http://localhost:6830/api/:path*',
      },
      {
        source: '/api/inpatient/:path*',
        destination: 'http://localhost:6831/api/:path*',
      },
      {
        source: '/api/diagnostics/:path*',
        destination: 'http://localhost:6832/api/:path*',
      },
      {
        source: '/api/operation-theater/:path*',
        destination: 'http://localhost:6833/api/:path*',
      },
      {
        source: '/api/pharmacy/:path*',
        destination: 'http://localhost:6834/api/:path*',
      },
      {
        source: '/api/finance/:path*',
        destination: 'http://localhost:6850/api/:path*',
      },
      // HR API requests handled by custom proxy at /api/hr/[...path]/route.ts
      // This ensures proper bearer token forwarding to HRMS
      {
        source: '/api/purchasing/:path*',
        destination: 'http://localhost:6870/api/:path*',
      },
      {
        source: '/api/chat/:path*',
        destination: 'http://localhost:6880/api/:path*',
      },
      {
        source: '/api/facility/:path*',
        destination: 'http://localhost:6840/api/:path*',
      },
      {
        source: '/api/analytics/:path*',
        destination: 'http://localhost:6820/api/:path*',
      },

      // Page-level proxy for auth service (standalone, not embedded in HMS)
      {
        source: '/auth',
        destination: 'http://localhost:6800/',
      },
      {
        source: '/auth/:path*',
        destination: 'http://localhost:6800/:path*',
      },
    ]
  },
}

module.exports = nextConfig