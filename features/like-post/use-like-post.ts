import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dislikePost, likePost } from '@/features/like-post/like-post-api';
import { useUser } from '@/entities/user/model/use-user';
import { postsQueries } from '@/features/post-feed/posts-query';
import { updatePostLikes } from '@/features/post-feed/update-posts-cache';

interface LikeVariables {
  postId: number;
  liked: boolean;
}

export const useLikePost = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: ({ postId, liked }: LikeVariables) =>
      liked ? dislikePost(postId) : likePost(postId),
    onSuccess: (data) => {
      queryClient.setQueryData(postsQueries.infinite().queryKey, (old) =>
        updatePostLikes(old, data, user?.id),
      );
    },
  });
};
