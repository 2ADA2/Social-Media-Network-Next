import { useInfiniteQuery } from '@tanstack/react-query';
import { postsQueries } from '@/features/post-feed/posts-query';

export const usePosts = () => {
  return useInfiniteQuery(postsQueries.infinite());
};
