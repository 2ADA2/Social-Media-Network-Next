import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook } from "vitest-browser-react";
import { ReactNode } from "react";
import { QueryProvider } from "@/app/providers/query-provider";
import { apiClient } from "@/shared/api/api-client";
import { useCommentAuthors } from "./use-comment-authors";
import type { CommentInterface, PublicUser } from "@/entities/comment/types";

vi.mock("@/shared/api/api-client", () => ({
  apiClient: { get: vi.fn() },
}));

const mockUser1: PublicUser = {
  id: 10,
  username: "user1",
  firstName: "User",
  secondName: "One",
  description: "Description 1",
  bio: "Bio 1",
  profileImage: "https://example.com/avatar1.jpg",
  creationDate: "2026-01-01",
};

const mockUser2: PublicUser = {
  id: 20,
  username: "user2",
  firstName: null,
  secondName: null,
  description: null,
  bio: null,
  profileImage: null,
  creationDate: null,
};

const mockComment1: CommentInterface = {
  id: 1,
  text: "First comment",
  authorId: 10,
  postId: 5,
  creationDate: "2026-01-01",
  modifiedDate: "2026-01-02",
  author: mockUser1,
};

const mockComment2: CommentInterface = {
  id: 2,
  text: "Second comment",
  authorId: 20,
  postId: 5,
  creationDate: "2026-01-01",
  modifiedDate: "2026-01-02",
  author: mockUser2,
};

describe("useCommentAuthors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryProvider>{children}</QueryProvider>
  );

  test("fetches unique authors and returns a map", async () => {
    vi.mocked(apiClient.get).mockImplementation(async (url: string) => {
      if (url === "/api/users/10") return { data: mockUser1 };
      if (url === "/api/users/20") return { data: mockUser2 };
      throw new Error("Unknown user");
    });

    const comments = [mockComment1, mockComment2];
    const { result } = await renderHook(() => useCommentAuthors(comments), {
      wrapper,
    });

    await vi.waitFor(() => {
      expect(result.current.size).toBe(2);
    });

    expect(apiClient.get).toHaveBeenCalledTimes(2);
    expect(apiClient.get).toHaveBeenCalledWith("/api/users/10");
    expect(apiClient.get).toHaveBeenCalledWith("/api/users/20");

    expect(result.current.get(10)).toEqual(mockUser1);
    expect(result.current.get(20)).toEqual(mockUser2);
  });

  test("does not fetch duplicate authors", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockUser1 });

    const comments = [mockComment1, { ...mockComment2, authorId: 10 }];
    const { result } = await renderHook(() => useCommentAuthors(comments), {
      wrapper,
    });

    await vi.waitFor(() => {
      expect(result.current.size).toBe(1);
    });

    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith("/api/users/10");
  });
});
