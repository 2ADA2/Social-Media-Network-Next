import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/api-client";
import type { CommentInterface } from "@/entities/comment/types";
import z from "zod";
import { AxiosError } from "axios";

const STALE_TIME = 5 * 60 * 1000;

const commentResponseSchema = z.object({
  id: z.number(),
  text: z.string(),
  authorId: z.number(),
  postId: z.number(),
  creationDate: z.string(),
  modifiedDate: z.string(),
});

const commentsResponseSchema = z.array(commentResponseSchema);

const fetchComments = async (postId: number): Promise<CommentInterface[]> => {
  try {
    const { data } = await apiClient.get<CommentInterface[]>(
      `/api/posts/${postId}/comments`,
    );

    commentsResponseSchema.parse(data);

    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(`Request error: Failed to fetch comments. ${e.message}`);
    } else if (e instanceof z.ZodError) {
      throw new Error(
        `Schema validation error: Invalid comments response. ${e.message}`,
      );
    } else if (e instanceof Error) {
      throw new Error(`Fetch comments error: ${e.message}`);
    }

    throw new Error("Unknown error: Failed to fetch comments");
  }
};

export const commentsQueries = {
  forPost: (postId: number) =>
    queryOptions({
      queryKey: ["comments", postId],
      queryFn: () => fetchComments(postId),
      staleTime: STALE_TIME,
    }),
};
