import { cache } from "react";
import { API_URL } from "@/app/lib/config";
import { ALL_POSTS_QUERY } from "@/features/post-feed/posts-query";
import type { Post } from "@/entities/post/types";

export const LIMIT = 100;

// TODO: use GET /api/post/[id]
export const getPostById = cache(async (id: number): Promise<Post | null> => {
  const response = await fetch(`${API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: ALL_POSTS_QUERY,
      variables: { limit: LIMIT, offset: 0 },
    }),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const json = await response.json();

  const currentPost: Post[] | null = json?.data?.allPosts.filter(
    (post: Post) => post.id === id,
  );

  return currentPost?.[0] ?? null;
});
