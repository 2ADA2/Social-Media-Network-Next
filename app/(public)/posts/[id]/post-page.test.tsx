import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import PostPage, { generateMetadata } from "./page";
import { getPostById } from "./get-post-by-id";
import { redirect } from "next/navigation";
import { Post } from "@/entities/post/types";

vi.mock("./get-post-by-id", () => ({
  getPostById: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/shared/lib/localization/format-relative-time", () => ({
  formatRelativeTime: vi.fn(() => "2 hours ago"),
}));

vi.mock("@/shared/lib/localization/format-relative-time", () => ({
  formatRelativeTime: vi.fn(() => "2 hours ago"),
}));

vi.mock("@/shared/ui/avatar", () => ({
  Avatar: ({ alt }: { alt: string }) => <div data-testid="avatar">{alt}</div>,
}));

vi.mock("./_components/post-control", () => ({
  PostControl: () => <div data-testid="post-control">PostControl</div>,
}));

vi.mock("./_components/post-image", () => ({
  PostImage: () => <div data-testid="post-image">PostImage</div>,
}));

vi.mock("@/features/post-feed/posts-list", () => ({
  PostsList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="posts-list">{children}</div>
  ),
}));

vi.mock("@/widgets/main-sidebar", () => ({
  MainSidebar: () => <div data-testid="main-sidebar">Sidebar</div>,
}));

vi.mock("@/features/post-feed/posts-list", () => ({
  PostsList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="posts-list">{children}</div>
  ),
}));

vi.mock("@/widgets/main-sidebar", () => ({
  MainSidebar: () => <div data-testid="main-sidebar">Sidebar</div>,
}));

const mockPost = {
  id: 1,
  title: "Test post title",
  content: "Test post content",
  image: "/image.jpg",
  creationDate: "2024-01-01",
  likesCount: 5,
  commentsCount: 2,
  likedByUsers: [{ id: 1 }],
  author: {
    id: 1,
    username: "testuser",
    firstName: "Test",
    secondName: "User",
    profileImage: "/avatar.jpg",
  },
} as Post;

describe("PostPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Renders post content", async () => {
    vi.mocked(getPostById).mockResolvedValue(mockPost);
    const element = await PostPage({ params: Promise.resolve({ id: "1" }) });
    const screen = await render(element);

    await expect.element(screen.getByText("Test post content")).toBeVisible();
    await expect.element(screen.getByTestId("avatar")).toBeVisible();
    await expect.element(screen.getByTestId("post-control")).toBeVisible();
    await expect.element(screen.getByTestId("post-image")).toBeVisible();
    await expect.element(screen.getByTestId("posts-list")).toBeVisible();
    await expect.element(screen.getByTestId("main-sidebar")).toBeVisible();
  });

  test("Redirects to home if post is not found", async () => {
    vi.mocked(getPostById).mockResolvedValue(null);

    await PostPage({ params: Promise.resolve({ id: "999" }) });

    expect(redirect).toHaveBeenCalledWith("/");
  });

  test("Generates metadata for existing post", async () => {
    vi.mocked(getPostById).mockResolvedValue(mockPost);

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "1" }),
    });

    expect(metadata.title).toBe("Test: Test post title | Sidekick Social");
    expect(metadata.description).toBe("Test post content");
  });

  test("Generates fallback metadata if post is not found", async () => {
    vi.mocked(getPostById).mockResolvedValue(null);

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "999" }),
    });

    expect(metadata.title).toBe("Post not found | Sidekick Social");
  });
});
