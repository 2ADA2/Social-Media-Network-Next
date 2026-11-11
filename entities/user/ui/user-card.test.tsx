import { describe, test, expect, vi } from "vitest";
import { render } from "vitest-browser-react";
import { UserCard } from "./user-card";

vi.mock("@/shared/ui/avatar", () => ({
  Avatar: ({ src, size }: { src: string; size: number }) => (
    <img
      data-testid="avatar"
      src={src}
      alt="avatar"
      width={size}
      height={size}
    />
  ),
}));

describe("UserCard", () => {
  const defaultProps = {
    avatarUrl: "https://example.com/avatar.jpg",
    title: "John Doe",
    subtitle: "johndoe",
  };

  test("renders title and subtitle", async () => {
    const screen = await render(<UserCard {...defaultProps} />);

    await expect.element(screen.getByText("John Doe")).toBeInTheDocument();
    await expect.element(screen.getByText("johndoe")).toBeInTheDocument();
  });

  test("passes avatar URL and size to Avatar component", async () => {
    const screen = await render(<UserCard {...defaultProps} />);

    const avatar = screen.getByTestId("avatar");
    await expect
      .element(avatar)
      .toHaveAttribute("src", "https://example.com/avatar.jpg");
    await expect.element(avatar).toHaveAttribute("width", "48");
  });
});
