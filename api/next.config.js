/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable API routes only (no pages)
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-API-Key, Content-Type' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
