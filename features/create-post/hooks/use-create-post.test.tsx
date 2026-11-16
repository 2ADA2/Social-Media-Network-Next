import { beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";
import { ReactNode } from "react";
import { QueryProvider } from "@/app/providers/query-provider";
import { apiClient, setTokenRefreshCallback } from "@/shared/api/api-client";
import { AxiosError } from "axios";
import { useCreatePost } from "./use-create-post";
import { createFile } from "@/test/create-file";

const { mockAdd } = vi.hoisted(() => ({
  mockAdd: vi.fn(),
}));

vi.mock("@/app/store/hooks", async () => ({
  useAppDispatch: () => vi.fn(),
}));

vi.mock("@/entities/user/model/user-slice", async () => ({
  setUser: vi.fn(),
  setCredentials: vi.fn(),
}));

vi.mock("@/shared/api/api-client", async () => ({
  apiClient: {
    post: vi.fn(),
  },
  setTokenRefreshCallback: vi.fn(),
}));

vi.mock(
  "@/app/providers/notifications-provider/useNotifications",
  async () => ({
    useNotifications: () => ({
      add: mockAdd,
    }),
  }),
);

const createPost = () => ({
  id: 1,
  title: "text",
  content: "text",
  image: "url",
});

describe("useCreatePost", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: createPost() });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryProvider>{children}</QueryProvider>
  );

  test("Returns responce on success and shows message", async () => {
    const { result } = await renderHook(() => useCreatePost(), { wrapper });

    result.current.mutate({
      title: "title",
      content: "content",
      file: null,
    });

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  test("Uploads image if file exsists", async () => {
    vi.resetAllMocks();
    vi.mocked(apiClient.post)
      .mockResolvedValueOnce({ data: { url: "url" } })
      .mockResolvedValueOnce({ data: createPost() });
    const { result } = await renderHook(() => useCreatePost(), { wrapper });

    const file = createFile({
      name: "image.png",
    });

    result.current.mutate({
      title: "title",
      content: "content",
      file: file,
    });

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(apiClient.post).toHaveBeenNthCalledWith(
      1,
      "/api/upload-image",
      expect.any(FormData),
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    expect(apiClient.post).toHaveBeenNthCalledWith(2, "/api/posts", {
      title: "title",
      content: "content",
      image: "url",
    });
  });

  test("Returns error on fail and shows message", async () => {
    vi.resetAllMocks();
    vi.mocked(apiClient.post).mockRejectedValue(
      new AxiosError("Request failed with status code 500"),
    );

    const { result } = await renderHook(() => useCreatePost(), { wrapper });

    result.current.mutate({
      title: "title",
      content: "content",
      file: null,
    });

    await vi.waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
