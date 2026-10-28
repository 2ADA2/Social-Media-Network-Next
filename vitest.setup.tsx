import { afterEach, beforeEach, vi } from 'vitest';
import { Globals } from '@react-spring/web';

Globals.assign({
  skipAnimation: true,
});

globalThis.process = {
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:4000/api',
    NODE_ENV: 'test',
  },
} as any;

vi.mock('next-intl', () => {
  return {
    useTranslations: () => (key: string, options?: Record<string, number | string>) =>
      options ? key + ' ' + JSON.stringify(options) : key,
    useLocale: () => 'en',
  };
});

vi.mock('@/features/auth/use-auth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />; 
  },
}));

vi.mock('@/entities/user/model/use-user', () => ({
  useUser: vi.fn(),
}));

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});
