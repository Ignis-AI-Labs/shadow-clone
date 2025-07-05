/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  swcMinify: false,
  // Needed for Cloudflare Pages
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Ensure proper environment variable handling
  env: {
    NEXT_PUBLIC_ADMIN_API_ENDPOINT: process.env.NEXT_PUBLIC_ADMIN_API_ENDPOINT || 'https://admin.ignislabs.ai',
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
}

module.exports = nextConfig