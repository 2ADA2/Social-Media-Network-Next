import { queryOptions } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/api-client';
import type { CommentInterface } from "@/entities/comment/types.ts";

const STALE_TIME = 5 * 60 * 1000;

const fetchComments = async (postId: number): Promise<CommentInterface[]> => {
  const { data } = await apiClient.get<CommentInterface[]>(`/api/posts/${ postId }/comments`);
  return data;
};

export const commentsQueries = {
  forPost: (postId: number) =>
    queryOptions({
      queryKey: ['comments', postId],
      queryFn: () => fetchComments(postId),
      staleTime: STALE_TIME,
    }),
};
