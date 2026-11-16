import { describe, test, expect, vi, beforeEach } from "vitest";
import { statsQueries } from "./stats";
import { apiClient } from "@/shared/api/api-client";

vi.mock("@/shared/api/api-client", () => ({
  apiClient: { get: vi.fn() },
}));

describe("statsQueries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("posts fetches my posts with correct params", async () => {
    const mockPosts = [{ id: 1, title: "Post 1" }];
    vi.mocked(apiClient.get).mockResolvedValue({ data: { items: mockPosts } });

    const options = statsQueries.posts();
    const result = await options.queryFn!({} as never);

    expect(apiClient.get).toHaveBeenCalledWith("/api/me/posts", {
      params: { limit: 100, offset: 0 },
    });
    expect(result).toEqual(mockPosts);
  });

  test("likes fetches my likes", async () => {
    const mockLikes = [{ id: 1, postId: 10 }];
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockLikes });

    const options = statsQueries.likes();
    const result = await options.queryFn!({} as never);

    expect(apiClient.get).toHaveBeenCalledWith("/api/me/likes");
    expect(result).toEqual(mockLikes);
  });

  test("comments fetches my comments", async () => {
    const mockComments = [{ id: 1, text: "Comment 1" }];
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockComments });

    const options = statsQueries.comments();
    const result = await options.queryFn!({} as never);

    expect(apiClient.get).toHaveBeenCalledWith("/api/me/comments");
    expect(result).toEqual(mockComments);
  });
});
