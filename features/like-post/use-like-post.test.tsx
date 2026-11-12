import { beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";
import { ReactNode } from "react";
import { QueryProvider } from "@/app/providers/query-provider";
import { apiClient } from "@/shared/api/api-client";
import { AxiosError } from "axios";
import { useLikePost } from "./use-like-post";
import { useUser } from "@/entities/user/model/use-user";

const { mockAdd } = vi.hoisted(() => ({
  mockAdd: vi.fn(),
}));

vi.mock("@/app/store/hooks", async () => ({
  useAppDispatch: () => vi.fn(),
}));

vi.mock("@/entities/user/model/use-user", async () => ({
  useUser: () => ({ user: { id: 1 } }),
}));

vi.mock("@/entities/user/model/user-slice", async () => ({
  setUser: vi.fn(),
  setCredentials: vi.fn(),
}));

vi.mock("@/shared/api/api-client", async () => ({
  apiClient: {
    post: vi.fn(),
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

describe("useLikePost", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        status: "liked",
        postId: 1,
        newLikesCount: 1,
      },
    });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryProvider>{children}</QueryProvider>
  );

  test("Successfully likes responce on success", async () => {
    const { result } = await renderHook(() => useLikePost(), { wrapper });

    result.current.mutate({
      postId: 1,
      liked: false,
    });

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(apiClient.post).toHaveBeenNthCalledWith(1, "/api/like", {
      postId: 1,
    });
  });

  test("Try to like and returns error on fail", async () => {
    vi.resetAllMocks();
    vi.mocked(apiClient.post).mockRejectedValue(
      new AxiosError("Request failed with status code 500"),
    );

    const { result } = await renderHook(() => useLikePost(), { wrapper });

    result.current.mutate({
      postId: 1,
      liked: false,
    });

    await vi.waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(apiClient.post).toHaveBeenNthCalledWith(1, "/api/like", {
      postId: 1,
    });
  });
  test("Successfully dislikes responce on success", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        status: "disliked",
        postId: 1,
        newLikesCount: 0,
      },
    });

    const { result } = await renderHook(() => useLikePost(), { wrapper });

    result.current.mutate({
      postId: 1,
      liked: true,
    });

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(apiClient.post).toHaveBeenNthCalledWith(1, "/api/dislike", {
      postId: 1,
    });
  });

  test("Try to dislike and returns error on fail", async () => {
    vi.resetAllMocks();
    vi.mocked(apiClient.post).mockRejectedValue(
      new AxiosError("Request failed with status code 500"),
    );

    const { result } = await renderHook(() => useLikePost(), { wrapper });

    result.current.mutate({
      postId: 1,
      liked: true,
    });

    await vi.waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(apiClient.post).toHaveBeenNthCalledWith(1, "/api/dislike", {
      postId: 1,
    });
  });
});
