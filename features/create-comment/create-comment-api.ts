import { apiClient } from '@/shared/api/api-client';
import type { CommentInterface } from '@/entities/comment/types';

export interface CreateCommentParams {
  postId: number;
  text: string;
}

export const createCommentApi = async (params: CreateCommentParams) => {
  const { data } = await apiClient.post<CommentInterface>(
    '/api/comments',
    params,
  );
  return data;
};
