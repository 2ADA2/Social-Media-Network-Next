import type { Like, Post, Comment } from "@/entities/post/types";
import { API_URL } from "@/app/lib/config";
import { cookies } from "next/headers";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return {};

  return { Authorization: `Bearer ${token}` };
};

export const fetchMyPosts = async (): Promise<Post[]> => {
  const res = await fetch(`${API_URL}/me/posts?limit=100&offset=0`, {
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) throw new Error("Failed to fetch posts");
  const data = await res.json();
  return data.items;
};

export const fetchMyLikes = async (): Promise<Like[]> => {
  const res = await fetch(`${API_URL}/me/likes`, {
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) throw new Error("Failed to fetch likes");
  return res.json();
};

export const fetchMyComments = async (): Promise<Comment[]> => {
  const res = await fetch(`${API_URL}/me/comments`, {
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
};
