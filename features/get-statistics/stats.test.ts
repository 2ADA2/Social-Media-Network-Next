import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { cookies } from "next/headers";
import { API_URL } from "@/app/lib/config";
import { fetchMyPosts, fetchMyLikes, fetchMyComments } from "./stats";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

const makeMyPost = (overrides = {}) => ({
  id: 1,
  title: "Post 1",
  content: "Content",
  image: null,
  authorId: 1,
  likesCount: 0,
  commentsCount: 0,
  creationDate: "2024-01-01T00:00:00.000Z",
  modifiedDate: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

const makeLike = (overrides = {}) => ({
  id: 1,
  postId: 10,
  userId: 1,
  creationDate: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

const makeComment = (overrides = {}) => ({
  id: 1,
  text: "Comment 1",
  postId: 10,
  authorId: 1,
  creationDate: "2024-01-01T00:00:00.000Z",
  modifiedDate: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

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

    const mockPosts = [makeMyPost()];
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        items: mockPosts,
        total: 1,
        limit: 100,
        offset: 0,
      }),
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

    const mockLikes = [makeLike()];
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
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

    const mockComments = [makeComment()];
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
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
      status: 200,
      json: async () => [],
    });

    await fetchMyLikes();

    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/me/likes`, {
      headers: {},
      cache: "no-store",
    });
  });

  test("throws request error if response is not ok", async () => {
    mockCookieStore.get.mockReturnValue({ value: "test-token" });

    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(fetchMyPosts()).rejects.toThrow(
      "request error : 500 Internal Server Error",
    );
  });

  test("throws UNAUTHORIZED on 401", async () => {
    mockCookieStore.get.mockReturnValue({ value: "test-token" });

    fetchMock.mockResolvedValue({ ok: false, status: 401 });

    await expect(fetchMyPosts()).rejects.toThrow("UNAUTHORIZED");
  });

  test("throws request error if fetch itself fails", async () => {
    mockCookieStore.get.mockReturnValue({ value: "test-token" });

    fetchMock.mockRejectedValue(new Error("network down"));

    await expect(fetchMyLikes()).rejects.toThrow(
      "request error : network down",
    );
  });

  test("throws parse error if body is not JSON", async () => {
    mockCookieStore.get.mockReturnValue({ value: "test-token" });

    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error("Unexpected token");
      },
    });

    await expect(fetchMyComments()).rejects.toThrow("parse error");
  });

  test("throws schema error if response does not match schema", async () => {
    mockCookieStore.get.mockReturnValue({ value: "test-token" });

    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [{ id: 1, postId: 10 }],
    });

    await expect(fetchMyLikes()).rejects.toThrow("schema error");
  });
});
