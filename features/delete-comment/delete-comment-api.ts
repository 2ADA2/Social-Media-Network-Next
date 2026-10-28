import { apiClient } from '@/shared/api/api-client';

export const deleteCommentRequest = async (
  commentId: number,
): Promise<void> => {
  await apiClient.delete(`/api/comments/${commentId}`);
};
