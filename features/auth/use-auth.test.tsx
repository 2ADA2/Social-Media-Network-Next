import { beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/api-client";
import { mockUserResponse } from "@/test/mockUsers";
import { mapUser } from "@/entities/user/model/mapUser";

vi.unmock("@/features/auth/use-auth");

import { useAuth } from "./use-auth";

const {
  mockDispatch,
  mockRefresh,
  mockSetCredentials,
  mockLogoutAction,
  mockSigninRequest,
  mockSignupRequest,
  mockFetchLogout,
  mockUpdateToken,
} = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
  mockRefresh: vi.fn(),
  mockSetCredentials: vi.fn((payload: unknown) => ({
    type: "user/setCredentials",
    payload,
  })),
  mockLogoutAction: vi.fn(() => ({ type: "user/logout" })),
  mockSigninRequest: vi.fn(),
  mockSignupRequest: vi.fn(),
  mockFetchLogout: vi.fn(),
  mockUpdateToken: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

vi.mock("@/app/store/hooks", () => ({
  useAppSelector: () => false,
  useAppDispatch: () => mockDispatch,
}));

vi.mock("@/entities/user/model/user-slice", () => ({
  logout: mockLogoutAction,
  setCredentials: mockSetCredentials,
}));

vi.mock("@/features/auth/signin", () => ({
  signinRequest: mockSigninRequest,
}));

vi.mock("@/features/auth/signup", () => ({
  signupRequest: mockSignupRequest,
}));

vi.mock("@/features/auth/logout", () => ({
  fetchLogout: mockFetchLogout,
}));

vi.mock("@/shared/lib/update-token", () => ({
  default: mockUpdateToken,
}));

describe("useAuth", () => {
  let queryClient: QueryClient;
  let clearSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockUserResponse });

    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    clearSpy = vi.spyOn(queryClient, "clear");
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  test("loads the current user and stores credentials", async () => {
    const user = mapUser(mockUserResponse);
    const credentials = { user, token: "token" };

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await result.current.auth("token");

    expect(apiClient.get).toHaveBeenCalledWith("/me");
    expect(mockSetCredentials).toHaveBeenCalledWith(credentials);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "user/setCredentials",
      payload: credentials,
    });
  });

  test("signin updates token, stores credentials and refreshes router", async () => {
    mockSigninRequest.mockResolvedValue({ token: "token" });
    const user = mapUser(mockUserResponse);
    const credentials = { user, token: "token" };

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await result.current.signin("test@example.com", "password");

    expect(mockSigninRequest).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });
    expect(mockUpdateToken).toHaveBeenCalledWith("token");
    expect(mockSetCredentials).toHaveBeenCalledWith(credentials);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "user/setCredentials",
      payload: credentials,
    });
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  test("signin clears token on error and rethrows", async () => {
    mockSigninRequest.mockRejectedValue(new Error("Invalid credentials"));

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await expect(
      result.current.signin("test@example.com", "wrong"),
    ).rejects.toThrow("Invalid credentials");

    expect(mockUpdateToken).toHaveBeenCalledWith("");
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  test("signup calls signupRequest then signin", async () => {
    mockSignupRequest.mockResolvedValue(undefined);
    mockSigninRequest.mockResolvedValue({ token: "token" });

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await result.current.signup({
      email: "test@example.com",
      password: "password",
      firstName: "John",
      secondName: "Doe",
    });

    expect(mockSignupRequest).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
      firstName: "John",
      secondName: "Doe",
    });
    expect(mockSigninRequest).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });

    const signupOrder = mockSignupRequest.mock.invocationCallOrder[0];
    const signinOrder = mockSigninRequest.mock.invocationCallOrder[0];
    expect(signupOrder).toBeLessThan(signinOrder);
  });

  test("logout calls fetchLogout, dispatches logout, clears query client and updates token", async () => {
    mockFetchLogout.mockResolvedValue(undefined);

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await result.current.logout();

    expect(mockFetchLogout).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({ type: "user/logout" });
    expect(clearSpy).toHaveBeenCalledTimes(1);
    expect(mockUpdateToken).toHaveBeenCalledWith("");
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
