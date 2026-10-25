import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import path from 'path';

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  turbopack: {
    resolveAlias: {
      '@': path.resolve(__dirname),
    },
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  async rewrites() {
    const apiUrl = process.env.API_URL ?? 'http://localhost:4000';
    return [
      { source: '/api/:path*', destination: `${apiUrl}/api/:path*` },
    ];
  },

  serverExternalPackages: ['@electric-sql/pglite'],
};

export default withAnalyzer(nextConfig);