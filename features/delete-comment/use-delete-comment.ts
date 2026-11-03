import { useMutation, useQueryClient } from '@tanstack/react-query';
import {  useTranslations } from "next-intl";
import { deleteCommentRequest } from './delete-comment-api';
import { useNotifications } from '@/app/providers/notifications-provider/useNotifications';
import { postsQueries } from '@/features/post-feed/posts-query';
import { updatePostCommentsCount } from '@/features/post-feed/update-posts-cache';

interface DeleteCommentVariables {
  commentId: number;
  postId: number;
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const { add } = useNotifications();
  const t = useTranslations('main');

  return useMutation({
    mutationFn: ({ commentId }: DeleteCommentVariables) =>
      deleteCommentRequest(commentId),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });

      queryClient.setQueryData(postsQueries.infinite().queryKey, (old) =>
        updatePostCommentsCount(old, postId, -1),
      );

      add({ message: t('comment.deleteSuccess') });
    },
    onError: () => {
      add({ message: t('comment.deleteError'), type: 'error' });
    },
  });
};
