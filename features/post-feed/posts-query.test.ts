import { apiClient } from "@/shared/api/api-client";
import { graphqlClient } from "@/shared/api/graphql-client";
import { AxiosError } from "axios";
import { beforeEach, describe, expect, it, test, vi } from "vitest";

import { dislikePost, likePost, postsQueries } from "./posts-query";

vi.mock("@/shared/api/api-client", () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

vi.mock("@/shared/api/graphql-client", () => ({
  graphqlClient: {
    request: vi.fn(),
  },
}));

const mockedGraphqlRequest = vi.mocked(graphqlClient.request);
const mockedApiPost = vi.mocked(apiClient.post);

const mockPost = {
  id: 1,
  title: "Test post",
  content: "Test content",
  image: null,
  authorId: 10,
  likesCount: 5,
  commentsCount: 2,
  creationDate: "2026-01-01",
  modifiedDate: "2026-01-02",
  author: {
    id: 10,
    username: "test-user",
    firstName: "Test",
    secondName: "User",
    profileImage: null,
  },
  likedByUsers: [
    {
      id: 10,
      username: "test-user",
    },
  ],
};

const mockLikeStatus = {
  status: "liked" as const,
  postId: 1,
  newLikesCount: 6,
};

describe("postsQueries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("infinite", () => {
    test("should fetch posts from the end and total count", async () => {
      mockedGraphqlRequest
        .mockResolvedValueOnce({ postsTotal: 100 })
        .mockResolvedValueOnce({ allPosts: [mockPost] });

      const options = postsQueries.infinite();

      const result = await options.queryFn!({ pageParam: 0 } as never);

      expect(mockedGraphqlRequest).toHaveBeenCalledTimes(2);

      expect(mockedGraphqlRequest).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
      );

      expect(mockedGraphqlRequest).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        {
          limit: 20,
          offset: 80,
        },
      );

      expect(result).toEqual({
        items: [mockPost],
        total: 100,
        limit: 20,
        offset: 80,
      });
    });

    test("should throw a schema error when posts response is invalid", async () => {
      mockedGraphqlRequest
        .mockResolvedValueOnce({ postsTotal: 100 })
        .mockResolvedValueOnce({ allPosts: [{ id: "invalid" }] });

      const options = postsQueries.infinite();

      await expect(options.queryFn!({ pageParam: 0 } as never)).rejects.toThrow(
        "schema error:",
      );
    });

    test("should throw a schema error when total response is invalid", async () => {
      mockedGraphqlRequest.mockResolvedValueOnce({ postsTotal: "invalid" });

      const options = postsQueries.infinite();

      await expect(options.queryFn!({ pageParam: 0 } as never)).rejects.toThrow(
        "schema error:",
      );
    });

    test("should wrap AxiosError as request error", async () => {
      mockedGraphqlRequest.mockRejectedValue(new AxiosError("Network error"));

      const options = postsQueries.infinite();

      await expect(options.queryFn!({ pageParam: 0 } as never)).rejects.toThrow(
        "request error : Network error",
      );
    });

    test("should throw unknown error for non-Error exceptions", async () => {
      mockedGraphqlRequest.mockRejectedValue("unexpected");

      const options = postsQueries.infinite();

      await expect(options.queryFn!({ pageParam: 0 } as never)).rejects.toThrow(
        "unknown error",
      );
    });
  });

  describe("byId", () => {
    test("should fetch a post by id", async () => {
      mockedGraphqlRequest.mockResolvedValue({
        post: mockPost,
      });

      const options = postsQueries.byId(1);

      const result = await options.queryFn!({} as never);

      expect(mockedGraphqlRequest).toHaveBeenCalledWith(expect.anything(), {
        id: 1,
      });

      expect(result).toEqual(mockPost);
    });

    test("should return null when post does not exist", async () => {
      mockedGraphqlRequest.mockResolvedValue({
        post: null,
      });

      const options = postsQueries.byId(999);

      const result = await options.queryFn!({} as never);

      expect(result).toBeNull();
    });

    test("should throw a schema error when response is invalid", async () => {
      mockedGraphqlRequest.mockResolvedValue({
        post: { id: "invalid" },
      });

      const options = postsQueries.byId(1);

      await expect(options.queryFn!({} as never)).rejects.toThrow(
        "schema error:",
      );
    });

    test("should wrap AxiosError as request error", async () => {
      mockedGraphqlRequest.mockRejectedValue(new AxiosError("Network error"));

      const options = postsQueries.byId(1);

      await expect(options.queryFn!({} as never)).rejects.toThrow(
        "request error : Network error",
      );
    });

    test("should throw unknown error for non-Error exceptions", async () => {
      mockedGraphqlRequest.mockRejectedValue("unexpected");

      const options = postsQueries.byId(1);

      await expect(options.queryFn!({} as never)).rejects.toThrow(
        "unknown error",
      );
    });
  });
});

describe("likePost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should send a like request", async () => {
    mockedApiPost.mockResolvedValue({
      data: mockLikeStatus,
    } as never);

    const result = await likePost(1);

    expect(mockedApiPost).toHaveBeenCalledWith("/api/like", {
      postId: 1,
    });

    expect(result).toEqual(mockLikeStatus);
  });

  test("should throw a schema error when response is invalid", async () => {
    mockedApiPost.mockResolvedValue({
      data: {
        status: "invalid",
        postId: 1,
        newLikesCount: 6,
      },
    } as never);

    await expect(likePost(1)).rejects.toThrow("schema error:");
  });

  test("should wrap AxiosError as request error", async () => {
    mockedApiPost.mockRejectedValue(new AxiosError("Network error"));

    await expect(likePost(1)).rejects.toThrow("request error : Network error");
  });

  test("should throw unknown error for non-Error exceptions", async () => {
    mockedApiPost.mockRejectedValue("unexpected");

    await expect(likePost(1)).rejects.toThrow("unknown error");
  });
});

describe("dislikePost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should send a dislike request", async () => {
    const response = {
      status: "disliked" as const,
      postId: 1,
      newLikesCount: 4,
    };

    mockedApiPost.mockResolvedValue({
      data: response,
    } as never);

    const result = await dislikePost(1);

    expect(mockedApiPost).toHaveBeenCalledWith("/api/dislike", {
      postId: 1,
    });

    expect(result).toEqual(response);
  });

  test("should throw a schema error when response is invalid", async () => {
    mockedApiPost.mockResolvedValue({
      data: {
        status: "invalid",
        postId: 1,
        newLikesCount: 4,
      },
    } as never);

    await expect(dislikePost(1)).rejects.toThrow("schema error:");
  });

  test("should wrap AxiosError as request error", async () => {
    mockedApiPost.mockRejectedValue(new AxiosError("Network error"));

    await expect(dislikePost(1)).rejects.toThrow(
      "request error : Network error",
    );
  });

  test("should throw unknown error for non-Error exceptions", async () => {
    mockedApiPost.mockRejectedValue("unexpected");

    await expect(dislikePost(1)).rejects.toThrow("unknown error");
  });
});
