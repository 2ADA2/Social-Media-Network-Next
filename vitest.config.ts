import { playwright } from '@vitest/browser-playwright';
import { resolve } from 'path';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  optimizeDeps: {
    include: [
      'react-dom/client',
      'vitest-browser-react',
      '@react-spring/web',
      '@tanstack/react-query',
    ],
  },
  plugins: [
    svgr({
      include: '**/*.svg', 
    }),
  ],
  test: {
    isolate: true,
    env: {
      TZ: 'UTC',
    },
    setupFiles: ['./vitest.setup.tsx'],
    alias: {
      '@': resolve(import.meta.dirname, './'), 
    },
    exclude: [
      'tests/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest}.config.*',
    ],
    browser: {
      enabled: true,
      instances: [{ browser: 'chromium' }],
      headless: true,
      provider: playwright(),
    },
    clearMocks: true,
    restoreMocks: true,
    environment: 'jsdom', 
    globals: true,
    coverage: {
      include: ['app/**/*.{ts,tsx}', 'shared/**/*.{ts,tsx}', 'features/**/*.{ts,tsx}', 'entities/**/*.{ts,tsx}'],
      exclude: [
        'tests/**',
        '**/*.styles.ts',
        '**/*.test.{ts,tsx}',
        '**/*.d.ts',
        '**/index.ts',
        'shared/config/**',
      ],
      provider: 'v8',
      thresholds: {
        lines: 70,
        functions: 60,
        branches: 70,
        statements: 70,
      },
    },
  },
});