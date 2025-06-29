/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://job-portal-1-ynet.onrender.com/api/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 