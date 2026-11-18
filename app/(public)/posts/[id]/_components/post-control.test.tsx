import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";
import { PostControl } from "./post-control";
import { useAuth } from "@/features/auth/use-auth";
import { useLikePost } from "@/features/like-post/use-like-post";

vi.mock("@/features/auth/use-auth", () => ({
  useAuth: vi.fn(() => ({ isAuth: true })),
}));

vi.mock("@/entities/user/model/use-user", () => ({
  useUser: vi.fn(() => ({ user: { id: "1" } })),
}));

vi.mock("@/features/like-post/use-like-post", () => ({
  useLikePost: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

vi.mock("@/features/get-comments/get-comments", () => ({
  commentsQueries: {
    forPost: (postId: number) => ({ queryKey: ["comments", postId] }),
  },
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(() => ({ data: [] })),
}));

vi.mock("@/entities/post/post-comments", () => ({
  PostComments: () => <div data-testid="post-comments">Comments</div>,
}));

describe("PostControl", () => {
  const defaultProps = {
    likesCount: 10,
    likedByUsers: [{ id: 1 }, { id: 2 }],
    postId: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Renders likes count and comments count", async () => {
    const screen = await render(<PostControl {...defaultProps} />);

    await expect
      .element(screen.getByText('post.likes {"count":10}'))
      .toBeVisible();
    await expect
      .element(screen.getByText('post.comments {"count":0}'))
      .toBeVisible();
  });

  test("Renders liked state if user is in likedByUsers", async () => {
    const screen = await render(<PostControl {...defaultProps} />);

    const likeButton = screen.getByRole("button", { name: "post.likeButton" });
    await expect.element(likeButton).toHaveAttribute("aria-pressed", "true");
  });

  test("Calls toggleLike on like button click", async () => {
    const mutate = vi.fn();
    vi.mocked(useLikePost).mockReturnValue({
      mutate,
      isPending: false,
    } as any);

    const screen = await render(<PostControl {...defaultProps} />);
    const likeButton = screen.getByRole("button", { name: "post.likeButton" });

    await userEvent.click(likeButton);

    expect(mutate).toHaveBeenCalledWith({ postId: 1, liked: true });
  });

  test("Updates likes count optimistically on click", async () => {
    const screen = await render(<PostControl {...defaultProps} />);
    const likeButton = screen.getByRole("button", { name: "post.likeButton" });

    await userEvent.click(likeButton);

    await expect
      .element(screen.getByText('post.likes {"count":9}'))
      .toBeVisible();
  });

  test("Opens comments on click", async () => {
    const screen = await render(<PostControl {...defaultProps} />);
    const commentsButton = screen.getByRole("button", {
      name: "post.commentsButton",
    });

    await userEvent.click(commentsButton);

    await expect.element(screen.getByTestId("post-comments")).toBeVisible();
  });

  test("Disables buttons if user is not authenticated", async () => {
    vi.mocked(useAuth).mockReturnValue({ isAuth: false } as any);

    const screen = await render(<PostControl {...defaultProps} />);

    const likeButton = screen.getByRole("button", { name: "post.likeButton" });
    const commentsButton = screen.getByRole("button", {
      name: "post.commentsButton",
    });

    await expect.element(likeButton).toBeDisabled();
    await expect.element(commentsButton).toBeDisabled();
  });
});
