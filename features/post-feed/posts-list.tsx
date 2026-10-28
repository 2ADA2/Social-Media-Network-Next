import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Post } from '@/entities/post';
import { Loader } from '@/shared/ui/loader';
import { CreatePost } from '@/features/create-post';
import { usePosts } from '@/features/post-feed/usePosts';
import { postsQueries } from '@/features/post-feed/posts-query';
import { useIntersectionObserver } from '@/shared/lib/hooks/use-intersection-observer';
import './posts-list.css';

export const PostsList = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isPending,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = usePosts();

  const posts = data?.pages.flatMap((page) => page.items) ?? [];

  const loadPosts = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handlePostCreated = () => {
    queryClient.invalidateQueries({
      queryKey: postsQueries.infinite().queryKey,
    });
  };

  const ref = useIntersectionObserver({ onIntersect: loadPosts });

  if (isPending && !posts.length) {
    return <Loader />;
  }

  if (isError) {
    throw new Error(error.message);
  }

  return (
    <>
      <CreatePost onAdd={handlePostCreated} />
      <div className="posts-container">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
        {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
        {isFetchingNextPage && <Loader isBlock={false} />}
      </div>
    </>
  );
};
