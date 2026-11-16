import { describe, expect, test, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import { type CommentInterface, type PublicUser } from "../comment/types";
import { Comment } from ".";
import { useUser } from "../user/model/use-user";
import { userEvent } from "vitest/browser";

const { mockMutate } = vi.hoisted(() => ({
  mockMutate: vi.fn(),
}));

vi.mock("@/features/delete-comment/use-delete-comment", async () => ({
  useDeleteComment: vi.fn().mockReturnValue({
    mutate: mockMutate,
    isPending: false,
  }),
}));

const commentAuthor: PublicUser = {
  id: 1,
  username: "hannamalek",
  firstName: "Hanna",
  secondName: "Malek",
  description: "text",
  bio: "text",
  profileImage: "text",
  creationDate: "text",
};

const commentData: CommentInterface = {
  id: 1,
  text: "commentText",
  authorId: 1,
  postId: 1,
  creationDate: "string",
  modifiedDate: "string",
  author: commentAuthor,
};

describe("Comment", () => {
  beforeEach(() => {
    vi.mocked(useUser).mockReturnValue({
      user: {
        id: 2,
        name: "Helena",
        surname: "Hills",
        username: "helenahills",
        email: "helena.hills@social.com",
        description: "Travel and design enthusiast.",
        avatar: "/assets/helena.png",
      },
    } as unknown as ReturnType<typeof useUser>);
  });

  test("Renders comment text and author's name, surname", async () => {
    const screen = await render(<Comment {...commentData} />);

    await expect.element(screen.getByTestId("comment")).toBeVisible();
    expect(screen.getByText("Hanna Malek")).toBeVisible();
  });

  test("Renders comment text and author's username if name and surname is not exists", async () => {
    const mockComment = structuredClone(commentData);
    mockComment.author!.firstName = "";
    mockComment.author!.secondName = "";

    const screen = await render(<Comment {...mockComment} />);

    await expect.element(screen.getByTestId("comment")).toBeVisible();
    expect(screen.getByText("hannamalek")).toBeVisible();
  });

  test("Renders 'user' if author is not exists", async () => {
    const mockComment = structuredClone(commentData);
    mockComment.author = null;

    const screen = await render(<Comment {...mockComment} />);

    await expect.element(screen.getByTestId("comment")).toBeVisible();
    expect(screen.getByText("user")).toBeVisible();
  });

  test("Can't delete the comment if user is not author", async () => {
    const screen = await render(<Comment {...commentData} />);

    await expect
      .element(screen.getByTestId("comment-delete"))
      .not.toBeInTheDocument();
  });

  test("Deletes the comment if user is author", async () => {
    vi.restoreAllMocks();
    vi.mocked(useUser).mockReturnValue({
      user: {
        id: 1,
        name: "Helena",
        surname: "Hills",
        username: "helenahills",
        email: "helena.hills@social.com",
        description: "Travel and design enthusiast.",
        avatar: "/assets/helena.png",
      },
    } as unknown as ReturnType<typeof useUser>);
    const user = userEvent.setup();

    const screen = await render(<Comment {...commentData} />);
    const deleteButton = screen.getByTestId("comment-delete");

    await expect.element(deleteButton).toBeVisible();
    await user.click(deleteButton);

    expect(mockMutate).toHaveBeenCalledWith({
      commentId: commentData.id,
      postId: commentData.postId,
    });
  });
});
