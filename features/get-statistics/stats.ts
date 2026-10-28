import { queryOptions } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/api-client';
import type { Like, Post, Comment } from "@/entities/post/types.ts";

const fetchMyPosts = async (): Promise<Post[]> => {
  const { data } = await apiClient.get<{ items: Post[] }>('/api/me/posts', {
    params: { limit: 100, offset: 0 },
  });
  return data.items;
};

const fetchMyLikes = async (): Promise<Like[]> => {
  const { data } = await apiClient.get<Like[]>('/api/me/likes');
  return data;
};

const fetchMyComments = async (): Promise<Comment[]> => {
  const { data } = await apiClient.get<Comment[]>('/api/me/comments');
  return data;
};

export const statsQueries = {
  posts: () =>
    queryOptions({
      queryKey: ['stats', 'posts'],
      queryFn: fetchMyPosts,
      staleTime: 5 * 60 * 1000,
    }),

  likes: () =>
    queryOptions({
      queryKey: ['stats', 'likes'],
      queryFn: fetchMyLikes,
      staleTime: 5 * 60 * 1000,
    }),

  comments: () =>
    queryOptions({
      queryKey: ['stats', 'comments'],
      queryFn: fetchMyComments,
      staleTime: 5 * 60 * 1000,
    }),
};
