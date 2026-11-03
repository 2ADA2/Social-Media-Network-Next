import { apiClient } from "@/shared/api/api-client";
import type { CommentInterface } from "@/entities/comment/types";
import z from "zod";
import { AxiosError } from "axios";

const publicUserResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  firstName: z.string().nullable(),
  secondName: z.string().nullable(),
  description: z.string().nullable(),
  bio: z.string().nullable(),
  profileImage: z.string().nullable(),
  creationDate: z.string().nullable(),
});

const createCommentResponseSchema = z.object({
  id: z.number(),
  text: z.string(),
  authorId: z.number(),
  postId: z.number(),
  creationDate: z.string(),
  modifiedDate: z.string(),
  author: publicUserResponseSchema.nullable(),
});

export interface CreateCommentParams {
  postId: number;
  text: string;
}

export const createCommentApi = async (
  params: CreateCommentParams,
): Promise<CommentInterface> => {
  try {
    const { data } = await apiClient.post<CommentInterface>(
      "/api/comments",
      params,
    );

    createCommentResponseSchema.parse(data);

    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(`Request error: Failed to create comment. ${e.message}`);
    } else if (e instanceof z.ZodError) {
      throw new Error(
        `Schema validation error: Invalid comment response. ${e.message}`,
      );
    } else if (e instanceof Error) {
      throw new Error(`Comment creation error: ${e.message}`);
    }

    throw new Error("Unknown error: Failed to create comment");
  }
};
