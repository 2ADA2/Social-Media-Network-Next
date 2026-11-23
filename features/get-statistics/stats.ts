import { cookies } from "next/headers";
import type z from "zod";
import { API_URL } from "@/app/lib/config";
import type { Comment, Like, MyPost } from "@/entities/post/types";
import { commentsSchema, likesSchema, myPostsPageSchema } from "./schemas";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return {};

  return { Authorization: `Bearer ${token}` };
};

const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : "unknown";

const request = async (path: string): Promise<unknown> => {
  const headers = await getAuthHeaders();
  let res: Response;

  try {
    res = await fetch(`${API_URL}${path}`, { headers, cache: "no-store" });
  } catch (e) {
    throw new Error(`request error : ${errorMessage(e)}`);
  }

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    throw new Error(`request error : ${res.status} ${res.statusText}`);
  }

  try {
    return await res.json();
  } catch (e) {
    throw new Error(`parse error : ${errorMessage(e)}`);
  }
};

const parseResponse = <T>(schema: z.ZodType<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (e) {
    throw new Error(`schema error: ${errorMessage(e)}`);
  }
};

export const fetchMyPosts = async (): Promise<MyPost[]> => {
  const data = await request("/me/posts?limit=100&offset=0");

  return parseResponse(myPostsPageSchema, data).items;
};

export const fetchMyLikes = async (): Promise<Like[]> => {
  const data = await request("/me/likes");

  return parseResponse(likesSchema, data);
};

export const fetchMyComments = async (): Promise<Comment[]> => {
  const data = await request("/me/comments");

  return parseResponse(commentsSchema, data);
};
