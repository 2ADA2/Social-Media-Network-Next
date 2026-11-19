import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { cookies } from "next/headers";
import { API_URL } from "@/app/lib/config";
import { fetchMyPosts, fetchMyLikes, fetchMyComments } from "./stats";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("stats server actions", () => {
  const fetchMock = vi.fn();
  const mockCookieStore = {
    get: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);

    vi.mocked(cookies).mockResolvedValue(mockCookieStore as never);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("posts fetches my posts with correct params and auth header", async () => {
    mockCookieStore.get.mockReturnValue({ value: "test-token" });

    const mockPosts = [{ id: 1, title: "Post 1" }];
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockPosts }),
    });

    const result = await fetchMyPosts();

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/me/posts?limit=100&offset=0`,
      {
        headers: { Authorization: "Bearer test-token" },
        cache: "no-store",
      },
    );
    expect(result).toEqual(mockPosts);
  });

  test("likes fetches my likes", async () => {
    mockCookieStore.get.mockReturnValue({ value: "test-token" });

    const mockLikes = [{ id: 1, postId: 10 }];
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockLikes,
    });

    const result = await fetchMyLikes();

    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/me/likes`, {
      headers: { Authorization: "Bearer test-token" },
      cache: "no-store",
    });
    expect(result).toEqual(mockLikes);
  });

  test("comments fetches my comments", async () => {
    mockCookieStore.get.mockReturnValue({ value: "test-token" });

    const mockComments = [{ id: 1, text: "Comment 1" }];
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockComments,
    });

    const result = await fetchMyComments();

    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/me/comments`, {
      headers: { Authorization: "Bearer test-token" },
      cache: "no-store",
    });
    expect(result).toEqual(mockComments);
  });

  test("sends empty headers if no token in cookies", async () => {
    mockCookieStore.get.mockReturnValue(undefined);

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await fetchMyLikes();

    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/me/likes`, {
      headers: {},
      cache: "no-store",
    });
  });

  test("throws error if response is not ok", async () => {
    mockCookieStore.get.mockReturnValue({ value: "test-token" });

    fetchMock.mockResolvedValue({
      ok: false,
    });

    await expect(fetchMyPosts()).rejects.toThrow("Failed to fetch posts");
  });
});
