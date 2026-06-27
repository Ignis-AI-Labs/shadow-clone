const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  outputFileTracingRoot: path.join(__dirname, '..'),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.join(__dirname, '..'),
    resolveAlias: {
      '@prompts': path.join(__dirname, '..', 'mcp-server', 'src', 'prompts', 'content'),
    },
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@prompts': path.join(__dirname, '..', 'mcp-server', 'src', 'prompts', 'content'),
    };
    return config;
  },
};
