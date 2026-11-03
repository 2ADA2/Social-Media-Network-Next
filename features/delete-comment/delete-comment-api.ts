import { apiClient } from "@/shared/api/api-client";
import { AxiosError } from "axios";

export const deleteCommentRequest = async (
  commentId: number,
): Promise<void> => {
  try {
    await apiClient.delete(`/api/comments/${commentId}`);
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(`Request error: Failed to delete comment. ${e.message}`);
    } else if (e instanceof Error) {
      throw new Error(`Delete comment error: ${e.message}`);
    }

    throw new Error("Unknown error: Failed to delete comment");
  }
};
