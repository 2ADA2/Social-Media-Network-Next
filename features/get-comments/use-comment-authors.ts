import { apiClient } from "@/shared/api/api-client";
import { useQueries } from "@tanstack/react-query";

import type { CommentInterface, PublicUser } from "@/entities/comment/types";
import z from "zod";
import { AxiosError } from "axios";

const STALE_TIME = 5 * 60 * 1000;

export const publicUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  firstName: z.string().nullable(),
  secondName: z.string().nullable(),
  description: z.string().nullable(),
  bio: z.string().nullable(),
  profileImage: z.string().nullable(),
  creationDate: z.string().nullable(),
}) satisfies z.ZodType<PublicUser>;

const fetchUser = async (id: number): Promise<PublicUser | undefined> => {
  try {
    const { data } = await apiClient.get<PublicUser>(`/users/${id}`);

    publicUserSchema.parse(data);

    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(`request error : ${e.message}`);
    } else if (e instanceof Error) {
      throw new Error(`schema error: ${e.message}`);
    }

    throw new Error("unknown error");
  }
};

export const useCommentAuthors = (comments: CommentInterface[]) => {
  const authorIds = [...new Set(comments.map((c) => c.authorId))];

  const userQueries = useQueries({
    queries: authorIds.map((id) => ({
      queryKey: ["user", id],
      queryFn: () => fetchUser(id),
      staleTime: STALE_TIME,
    })),
  });

  return {
    usersMap: new Map(
      userQueries
        .map((q) => q.data)
        .filter((u): u is PublicUser => !!u)
        .map((u) => [u.id, u]),
    ),
    authorsCount: authorIds.length,
  };
};
