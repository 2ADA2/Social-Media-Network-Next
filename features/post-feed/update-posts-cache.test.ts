import { describe, expect, test } from "vitest";
import type { InfiniteData } from "@tanstack/react-query";
import type { PostsPage } from "@/entities/post/types";
import {
  removePost,
  updatePostLikes,
  updatePostCommentsCount,
} from "./update-posts-cache";

const mockData = {
  pageParams: [1],
  pages: [
    {
      items: [
        {
          id: 1,
          text: "Post 1",
          likesCount: 10,
          commentsCount: 5,
          likedByUsers: [{ id: 100 }, { id: 200 }],
        },
        {
          id: 2,
          text: "Post 2",
          likesCount: 5,
          commentsCount: 2,
          likedByUsers: [],
        },
      ],
      nextCursor: 2,
    },
    {
      items: [
        {
          id: 3,
          text: "Post 3",
          likesCount: 0,
          commentsCount: 1,
          likedByUsers: [],
        },
      ],
      nextCursor: null,
    },
  ],
} as unknown as InfiniteData<PostsPage>;

describe("removePost", () => {
  test("Removes post from all pages", () => {
    const result = removePost(mockData, 1);

    expect(result?.pages[0].items).toHaveLength(1);
    expect(result?.pages[0].items[0].id).toBe(2);
    expect(result?.pages[1].items).toHaveLength(1);
  });

  test("Removes post from second page", () => {
    const result = removePost(mockData, 3);

    expect(result?.pages[0].items).toHaveLength(2);
    expect(result?.pages[1].items).toHaveLength(0);
  });

  test("Does nothing if post is not found", () => {
    const result = removePost(mockData, 999);

    expect(result?.pages[0].items).toHaveLength(2);
    expect(result?.pages[1].items).toHaveLength(1);
  });

  test("Returns undefined if old is undefined", () => {
    expect(removePost(undefined, 1)).toBeUndefined();
  });
});

describe("updatePostLikes", () => {
  test("Adds like when user already liked", () => {
    const result = updatePostLikes(
      mockData,
      { postId: 1, status: "liked", newLikesCount: 11 },
      "100",
    );

    const post = result?.pages[0].items[0];
    expect(post?.likesCount).toBe(11);
    expect(post?.likedByUsers).toHaveLength(2);
  });

  test("Adds like when user is new", () => {
    const result = updatePostLikes(
      mockData,
      { postId: 1, status: "liked", newLikesCount: 11 },
      "300",
    );

    const post = result?.pages[0].items[0];
    expect(post?.likesCount).toBe(11);
    expect(post?.likedByUsers).toHaveLength(3);
    expect(post?.likedByUsers).toContainEqual({ id: 300 });
  });

  test("Removes like on unliked status", () => {
    const result = updatePostLikes(
      mockData,
      { postId: 1, status: "disliked", newLikesCount: 9 },
      "100",
    );

    const post = result?.pages[0].items[0];
    expect(post?.likesCount).toBe(9);
    expect(post?.likedByUsers).toHaveLength(1);
    expect(post?.likedByUsers).not.toContainEqual({ id: 100 });
  });

  test("Does nothing if currentUserId is missing", () => {
    const result = updatePostLikes(
      mockData,
      { postId: 1, status: "liked", newLikesCount: 11 },
      undefined,
    );

    expect(result).toEqual(mockData);
  });

  test("Returns undefined if old is undefined", () => {
    expect(
      updatePostLikes(
        undefined,
        { postId: 1, status: "liked", newLikesCount: 11 },
        "1",
      ),
    ).toBeUndefined();
  });
});

describe("updatePostCommentsCount", () => {
  test("Increments comments count", () => {
    const result = updatePostCommentsCount(mockData, 1, 1);
    const post = result?.pages[0].items[0];
    expect(post?.commentsCount).toBe(6);
  });

  test("Decrements comments count", () => {
    const result = updatePostCommentsCount(mockData, 1, -1);
    const post = result?.pages[0].items[0];
    expect(post?.commentsCount).toBe(4);
  });

  test("Does not drop below zero", () => {
    const result = updatePostCommentsCount(mockData, 3, -1);
    let post = result?.pages[1].items[0];
    expect(post?.commentsCount).toBe(0);

    const result2 = updatePostCommentsCount(result, 3, -1);
    post = result2?.pages[1].items[0];
    expect(post?.commentsCount).toBe(0);
  });

  test("Updates post on second page", () => {
    const result = updatePostCommentsCount(mockData, 3, 1);
    const post = result?.pages[1].items[0];
    expect(post?.commentsCount).toBe(2);
  });

  test("Returns undefined if old is undefined", () => {
    expect(updatePostCommentsCount(undefined, 1, 1)).toBeUndefined();
  });
});
