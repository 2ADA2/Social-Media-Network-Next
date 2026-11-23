import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook } from "vitest-browser-react";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCreateComment } from "./use-create-comment";
import { createCommentApi } from "@/features/create-comment/create-comment-api";
import { postsQueries } from "@/features/post-feed/posts-query";
import { updatePostCommentsCount } from "@/features/post-feed/update-posts-cache";

vi.mock("@/features/create-comment/create-comment-api", () => ({
  createCommentApi: vi.fn(),
}));

vi.mock("@/features/post-feed/update-posts-cache", () => ({
  updatePostCommentsCount: vi.fn(),
}));

type Params = Parameters<typeof createCommentApi>[0];

const params = { postId: 5, text: "Hello" } as Params;
const postsKey = postsQueries.infinite().queryKey;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { queryClient, Wrapper };
};

describe("useCreateComment", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("calls createCommentApi with params", async () => {
    vi.mocked(createCommentApi).mockResolvedValue(undefined as never);

    const { Wrapper } = createWrapper();
    const { result } = await renderHook(() => useCreateComment(), {
      wrapper: Wrapper,
    });

    result.current.mutate(params);

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(createCommentApi).toHaveBeenCalledTimes(1);
    expect(vi.mocked(createCommentApi).mock.calls[0][0]).toEqual(params);
  });

  test("invalidates comments query of the post on success", async () => {
    vi.mocked(createCommentApi).mockResolvedValue(undefined as never);

    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = await renderHook(() => useCreateComment(), {
      wrapper: Wrapper,
    });

    result.current.mutate(params);

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["comments", 5],
    });
  });

  test("increments comments count in posts cache on success", async () => {
    vi.mocked(createCommentApi).mockResolvedValue(undefined as never);

    const initial = { pages: [{ items: [{ id: 5, commentsCount: 1 }] }] };
    const updated = { pages: [{ items: [{ id: 5, commentsCount: 2 }] }] };
    vi.mocked(updatePostCommentsCount).mockReturnValue(updated as never);

    const { queryClient, Wrapper } = createWrapper();
    queryClient.setQueryData(postsKey, initial as never);

    const { result } = await renderHook(() => useCreateComment(), {
      wrapper: Wrapper,
    });

    result.current.mutate(params);

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(updatePostCommentsCount).toHaveBeenCalledWith(initial, 5, 1);
    expect(queryClient.getQueryData(postsKey)).toEqual(updated);
  });

  test("does not touch caches if request fails", async () => {
    vi.mocked(createCommentApi).mockRejectedValue(new Error("boom"));

    const initial = { pages: [{ items: [{ id: 5, commentsCount: 1 }] }] };

    const { queryClient, Wrapper } = createWrapper();
    queryClient.setQueryData(postsKey, initial as never);
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = await renderHook(() => useCreateComment(), {
      wrapper: Wrapper,
    });

    result.current.mutate(params);

    await vi.waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(updatePostCommentsCount).not.toHaveBeenCalled();
    expect(queryClient.getQueryData(postsKey)).toEqual(initial);
  });
});
