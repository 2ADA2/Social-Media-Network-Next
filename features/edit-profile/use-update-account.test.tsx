import { beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";
import { ReactNode } from "react";
import { QueryProvider } from "@/app/providers/query-provider";
import { apiClient } from "@/shared/api/api-client";
import { AxiosError } from "axios";
import { useUpdateAccount } from "./use-update-account";
import { mockUserResponse } from "@/test/mockUsers";
import { setCredentials } from "@/entities/user/model/user-slice";

const mockAdd = vi.fn();

vi.mock("@/app/store/hooks", async () => ({
  useAppDispatch: () => vi.fn(),
}));

vi.mock("@/entities/user/model/user-slice", async () => ({
  setUser: vi.fn(),
  setCredentials: vi.fn(),
}));

vi.mock("@/shared/api/api-client", async () => ({
  apiClient: {
    put: vi.fn(),
  },
}));

vi.mock(
  "@/app/providers/notifications-provider/useNotifications",
  async () => ({
    useNotifications: () => ({
      add: mockAdd,
    }),
  }),
);

describe("useDeleteComment", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryProvider>{children}</QueryProvider>
  );

  test("Returns responce on success and shows message", async () => {
    vi.mocked(apiClient.put).mockResolvedValue({
      data: { user: mockUserResponse },
    });
    const { result } = await renderHook(() => useUpdateAccount(), { wrapper });

    result.current.mutate({
      currentPassword: "123",
      email: "ada",
      password: "123",
    });

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  test("Returns error on fail and shows message", async () => {
    vi.mocked(apiClient.put).mockRejectedValue(
      new AxiosError("Request failed with status code 500"),
    );

    const { result } = await renderHook(() => useUpdateAccount(), { wrapper });

    result.current.mutate({
      currentPassword: "123",
      email: "ada",
      password: "123",
    });

    await vi.waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
