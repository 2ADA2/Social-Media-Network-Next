import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { deletePostRequest } from './delete-post-api';
import { postsQueries } from '@/features/post-feed/posts-query';
import { removePost } from '@/features/post-feed/update-posts-cache';
import { useNotifications } from '@/app/providers/notifications-provider/useNotifications';

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { add } = useNotifications();
  const { t } = useTranslation('main');

  return useMutation({
    mutationFn: (postId: number) => deletePostRequest(postId),
    onSuccess: (_, postId) => {
      queryClient.setQueryData(postsQueries.infinite().queryKey, (old) =>
        removePost(old, postId),
      );

      add({ message: t('post.deleteSuccess') });
    },
    onError: () => {
      add({ message: t('post.deleteError'), type: 'error' });
    },
  });
};
