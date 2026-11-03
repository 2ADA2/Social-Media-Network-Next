import { apiClient } from "@/shared/api/api-client";
import type { CommentInterface } from "@/entities/comment/types";
import { AxiosError } from "axios";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { createCommentApi } from "./create-comment-api";

vi.mock("@/shared/api/api-client", async () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

const mockComment = {
  id: 1,
  text: "Hello",
  authorId: 1,
  postId: 42,
  creationDate: "2024-01-01T00:00:00.000Z",
  modifiedDate: "2024-01-01T00:00:00.000Z",
  author: {
    id: 1,
    username: "helena",
    firstName: null,
    secondName: null,
    description: null,
    bio: null,
    profileImage: null,
    creationDate: null,
  },
} satisfies CommentInterface;

describe("createCommentApi", () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockReset();
  });

  test("Sends POST request with correct params", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: mockComment });

    const result = await createCommentApi({ postId: 42, text: "Hello" });

    expect(apiClient.post).toHaveBeenCalledWith("/api/comments", {
      postId: 42,
      text: "Hello",
    });
    expect(result).toEqual(mockComment);
  });

  test("throws error when request fails", async () => {
    vi.mocked(apiClient.post).mockRejectedValue(
      new AxiosError("Request failed with status code 500"),
    );

    await expect(
      createCommentApi({ postId: 42, text: "Hello" }),
    ).rejects.toThrow("Request error");
  });

  test("throws error when response does not match schema", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        ...mockComment,
        authorId: undefined,
      },
    });

    await expect(
      createCommentApi({ postId: 42, text: "Hello" }),
    ).rejects.toThrow("Schema validation error");
  });
});
