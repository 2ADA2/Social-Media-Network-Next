import { apiClient } from "@/shared/api/api-client";
import z from "zod";
import { AxiosError } from "axios";

const likeStatusResponseSchema = z.object({
  status: z.enum(["liked", "already_liked", "disliked", "not_liked"]),
  postId: z.number(),
  newLikesCount: z.number(),
});

export type LikeStatus = z.infer<typeof likeStatusResponseSchema>;

export const likePost = async (postId: number): Promise<LikeStatus> => {
  try {
    const { data } = await apiClient.post<LikeStatus>("/api/like", { postId });

    likeStatusResponseSchema.parse(data);

    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(`Request error: Failed to like post. ${e.message}`);
    } else if (e instanceof z.ZodError) {
      throw new Error(
        `Schema validation error: Invalid like response. ${e.message}`,
      );
    } else if (e instanceof Error) {
      throw new Error(`Like post error: ${e.message}`);
    }

    throw new Error("Unknown error: Failed to like post");
  }
};

export const dislikePost = async (postId: number): Promise<LikeStatus> => {
  try {
    const { data } = await apiClient.post<LikeStatus>("/api/dislike", {
      postId,
    });

    likeStatusResponseSchema.parse(data);

    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(`Request error: Failed to dislike post. ${e.message}`);
    } else if (e instanceof z.ZodError) {
      throw new Error(
        `Schema validation error: Invalid dislike response. ${e.message}`,
      );
    } else if (e instanceof Error) {
      throw new Error(`Dislike post error: ${e.message}`);
    }

    throw new Error("Unknown error: Failed to dislike post");
  }
};
