import { apiClient } from '@/shared/api/api-client';

export const deletePostRequest = async (postId: number): Promise<void> => {
  await apiClient.delete(`/api/posts/${postId}`);
};
