const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '192.168.10.11',
    '192.168.10.11:3000',
    '192.168.10.10',
    '192.168.10.10:3000',
    'localhost:3000',
    '127.0.0.1:3000'
  ],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: '/static/:path*',
        destination: `${BACKEND_URL}/static/:path*`,
      },
    ];
  },
};

export default nextConfig;

