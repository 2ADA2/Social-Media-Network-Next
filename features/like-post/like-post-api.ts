import { apiClient } from '@/shared/api/api-client';

export interface LikeStatus {
  status: 'liked' | 'already_liked' | 'disliked' | 'not_liked';
  postId: number;
  newLikesCount: number;
}

export const likePost = async (postId: number): Promise<LikeStatus> => {
  const { data } = await apiClient.post<LikeStatus>('/api/like', { postId });
  return data;
};

export const dislikePost = async (postId: number): Promise<LikeStatus> => {
  const { data } = await apiClient.post<LikeStatus>('/api/dislike', { postId });
  return data;
};
