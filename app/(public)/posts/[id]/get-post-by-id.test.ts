import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { getPostById } from "./get-post-by-id";
import { API_URL } from "@/app/lib/config";

vi.mock("@/app/lib/config", () => ({
  API_URL: "http://localhost:4000",
}));

vi.mock("@/features/post-feed/posts-query", () => ({
  ALL_POSTS_QUERY: "query AllPosts { ... }",
}));

describe("getPostById", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  test("Returns post on successful response", async () => {
    const mockPost = { id: 101, title: "Post 1", content: "Content" };
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { allPosts: [mockPost] } }),
    });

    const result = await getPostById(101);

    expect(result).toEqual(mockPost);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("Returns null if response is not ok", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
    });

    const result = await getPostById(102);

    expect(result).toBeNull();
  });

  test("Returns null if post is not found", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { allPosts: [] } }),
    });

    const result = await getPostById(103);

    expect(result).toBeNull();
  });

  test("Returns null if data is missing in response", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const result = await getPostById(104);

    expect(result).toBeNull();
  });
});
