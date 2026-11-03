import { apiClient } from "@/shared/api/api-client";
import type { Post } from "@/entities/post/types.ts";
import z from "zod";
import { AxiosError } from "axios";

const createPostResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  image: z.string().nullable().optional(),
});

type CreatePostParams = {
  title: string;
  content: string;
  image?: string;
};

export const createPostRequest = async (
  params: CreatePostParams,
): Promise<Post> => {
  try {
    const { data } = await apiClient.post<Post>("/api/posts", params);

    createPostResponseSchema.parse(data);

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
