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

vi.mock('@/shared/config/i18n', () => ({
  default: {
    t: (key: string, options?: Record<string, number | string>) =>
      options ? key + ' ' + JSON.stringify(options) : key,
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, number | string>) =>
      options ? key + ' ' + JSON.stringify(options) : key,
    i18n: {
      changeLanguage: vi.fn(),
      language: 'en',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

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
