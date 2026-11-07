import type { NextConfig } from "next";
import path from "path";
import { createRequire } from "module";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const require = createRequire(import.meta.url);
const svgrLoaderPath = require.resolve("@svgr/webpack");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  turbopack: {
    resolveAlias: {
      "@": path.resolve(__dirname),
    },
    rules: {
      "*.svg": {
        loaders: [svgrLoaderPath],
        as: "*.js",
      },
    },
  },

  webpack(config, { dev }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [svgrLoaderPath],
    });
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },

  async rewrites() {
    const apiUrl = process.env.API_URL ?? "http://localhost:4000";
    return [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }];
  },

  serverExternalPackages: ["@electric-sql/pglite"],
};

export default withNextIntl(nextConfig);
