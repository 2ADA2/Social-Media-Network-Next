import { useQueries } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/api-client';
import type { CommentInterface, PublicUser } from '@/entities/comment/types';

const STALE_TIME = 5 * 60 * 1000;

const fetchUser = async (id: number): Promise<PublicUser> => {
  const { data } = await apiClient.get<PublicUser>(`/api/users/${id}`);
  return data;
};

export const useCommentAuthors = (comments: CommentInterface[]) => {
  const authorIds = [...new Set(comments.map((c) => c.authorId))];

  const userQueries = useQueries({
    queries: authorIds.map((id) => ({
      queryKey: ['user', id],
      queryFn: () => fetchUser(id),
      staleTime: STALE_TIME,
    })),
  });

  return new Map(
    userQueries
      .map((q) => q.data)
      .filter((u): u is PublicUser => !!u)
      .map((u) => [u.id, u]),
  );
};
