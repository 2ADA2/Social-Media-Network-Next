import { describe, test, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/shared/api/api-client";
import { commentsQueries } from "./get-comments";
import { AxiosError } from "axios";

vi.mock("@/shared/api/api-client", () => ({
  apiClient: { get: vi.fn() },
}));

const mockComment = {
  id: 1,
  text: "Test comment",
  authorId: 10,
  postId: 5,
  creationDate: "2026-01-01",
  modifiedDate: "2026-01-02",
};

describe("getComments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("fetches comments for a specific post", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: [mockComment],
    });

    const options = commentsQueries.forPost(5);
    const result = await options.queryFn!({} as never);

    expect(apiClient.get).toHaveBeenCalledWith("/api/posts/5/comments");
    expect(result).toEqual([mockComment]);
  });

  test("throws an error if the request fails", async () => {
    vi.mocked(apiClient.get).mockRejectedValue(
      new AxiosError("Request failed with status code 500"),
    );

    const options = commentsQueries.forPost(5);

    await expect(options.queryFn!({} as never)).rejects.toThrow();
  });
});
