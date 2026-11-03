import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCommentApi } from '@/features/create-comment/create-comment-api';
import { postsQueries } from '@/features/post-feed/posts-query';
import { updatePostCommentsCount } from '@/features/post-feed/update-posts-cache';

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommentApi,
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', params.postId],
      });

      queryClient.setQueryData(postsQueries.infinite().queryKey, (old) =>
        updatePostCommentsCount(old, params.postId, +1),
      );
    },
  });
};
