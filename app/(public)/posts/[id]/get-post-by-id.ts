"use server";
import { cache } from "react";
import { API_URL } from "@/app/lib/config";
import { ALL_POSTS_QUERY } from "@/features/post-feed/posts-query";
import type { Post } from "@/entities/post/types";

const MIN_ID = 100;

export const getPostById = cache(async (id: string): Promise<Post | null> => {
  const response = await fetch(`${API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: ALL_POSTS_QUERY,
      variables: { limit: 1, offset: Number(id) - MIN_ID - 1 },
    }),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const json = await response.json();
  return json.data?.allPosts?.[0] ?? null;
});
