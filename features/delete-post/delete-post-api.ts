import { apiClient } from "@/shared/api/api-client";
import { AxiosError } from "axios";

export const deletePostRequest = async (postId: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/posts/${postId}`);
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(`Request error: Failed to delete post. ${e.message}`);
    } else if (e instanceof Error) {
      throw new Error(`Delete post error: ${e.message}`);
    }

    throw new Error("Unknown error: Failed to delete post");
  }
};
