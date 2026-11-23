import { beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";
import { ReactNode } from "react";
import { QueryProvider } from "@/app/providers/query-provider";
import { apiClient } from "@/shared/api/api-client";
import { AxiosError } from "axios";
import { useCreateComment } from "../create-comment/use-create-comment";

describe("useCreateComment", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryProvider>{children}</QueryProvider>
  );

  test("Returns success on create", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

    const { result } = await renderHook(() => useCreateComment(), { wrapper });

    result.current.mutate({ postId: 5, text: "Hello" });

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(apiClient.post).toHaveBeenCalledTimes(1);
  });

  test("Returns error on fail", async () => {
    vi.mocked(apiClient.post).mockRejectedValue(
      new AxiosError("Request failed with status code 500"),
    );

    const { result } = await renderHook(() => useCreateComment(), { wrapper });

    result.current.mutate({ postId: 5, text: "Hello" });

    await vi.waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
