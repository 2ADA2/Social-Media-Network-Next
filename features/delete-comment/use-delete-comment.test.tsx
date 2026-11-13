import { beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";
import { useDeleteComment } from "./use-delete-comment";
import { ReactNode } from "react";
import { QueryProvider } from "@/app/providers/query-provider";
import { apiClient } from "@/shared/api/api-client";
import { AxiosError } from "axios";

const mockAdd = vi.fn();

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
    const { result } = await renderHook(() => useDeleteComment(), { wrapper });

    result.current.mutate({ commentId: 1, postId: 10 });

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockAdd).toHaveBeenCalled();
  });

  test("Returns error on fail and shows message", async () => {
    vi.mocked(apiClient.delete).mockRejectedValue(
      new AxiosError("Request failed with status code 500"),
    );

    const { result } = await renderHook(() => useDeleteComment(), { wrapper });

    result.current.mutate({ commentId: 1, postId: 10 });

    await vi.waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockAdd).toHaveBeenCalled();
  });
});
