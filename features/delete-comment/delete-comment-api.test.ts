import { apiClient } from "@/shared/api/api-client";
import { AxiosError } from "axios";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { deleteCommentRequest } from "./delete-comment-api";
import { useDeleteComment } from "./use-delete-comment";
import { QueryClient } from "@tanstack/react-query";

vi.mock("@/shared/api/api-client", async () => ({
  apiClient: {
    delete: vi.fn(),
  },
}));

describe("deleteCommentApi", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    // Создаем новый QueryClient для каждого теста, чтобы изолировать кэш
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    });
    vi.mocked(apiClient.delete).mockReset();
  });

  test("Sends DELETE request with correct params", async () => {
    await deleteCommentRequest(1);

    expect(apiClient.delete).toHaveBeenCalledWith("/api/comments/1");
  });

  test("throws error when request fails", async () => {
    vi.mocked(apiClient.delete).mockRejectedValue(
      new AxiosError("Request failed with status code 500"),
    );

    await expect(deleteCommentRequest(1)).rejects.toThrow("Request error");
  });
});
