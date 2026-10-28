import { apiClient } from '@/shared/api/api-client';
import type { Post } from "@/entities/post/types.ts";

export interface CreatePostParams {
  title: string;
  content: string;
  image?: string;
}

export const createPostRequest = async (params: CreatePostParams) => {
  const { data } = await apiClient.post<Post>('/api/posts', params);
  return data;
};
