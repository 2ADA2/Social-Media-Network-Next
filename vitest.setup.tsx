import { afterEach, beforeEach, vi } from "vitest";
import { Globals } from "@react-spring/web";
import { setTokenRefreshCallback } from "./shared/api/api-client";

Globals.assign({
  skipAnimation: true,
});

globalThis.process = {
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:4000/api",
    NODE_ENV: "test",
  },
} as any;

vi.mock("@/shared/api/api-client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
  setTokenRefreshCallback: vi.fn(),
}));

vi.mock("next/navigation", (original) => ({
  ...original,
  redirect: vi.fn(),
  useRouter: () => vi.fn(),
}));

vi.mock("@/app/store/hooks", (original) => ({
  ...original,
  useAppSelector: (fn: () => unknown) => fn(),
}));

vi.mock("@/entities/user/model/selectors", (original) => ({
  ...original,
  selectIsInit: () => true,
}));

vi.mock("next-intl", () => {
  return {
    useTranslations:
      () => (key: string, options?: Record<string, number | string>) =>
        options ? key + " " + JSON.stringify(options) : key,
    useLocale: () => "en",
  };
});

vi.mock("@/features/auth/use-auth", () => ({
  useAuth: () => ({
    isAuth: false,
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

vi.mock("@/entities/user/model/use-user", () => ({
  useUser: vi.fn(),
}));

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});
