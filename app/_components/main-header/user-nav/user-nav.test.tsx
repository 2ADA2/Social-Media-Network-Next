import { describe, expect, test, vi } from "vitest";
import { UserNav } from "./";
import { useUser } from "@/entities/user/model/use-user";
import { authUser, nullUser } from "@/test/mock-hooks";
import { renderWithRouter } from "@/test/render-with-router";

vi.mock("@/features/auth/use-auth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/entities/user/model/use-user", () => ({
  useUser: vi.fn(),
}));

describe("UserNav component", () => {
  test("dont renders if no user", async () => {
    vi.mocked(useUser).mockReturnValue(nullUser);
    const screen = await renderWithRouter(<UserNav />);

    await expect.element(screen.getByRole("img")).not.toBeInTheDocument();
  });

  test("renders if user is authenticated", async () => {
    vi.mocked(useUser).mockReturnValue(authUser);
    const screen = await renderWithRouter(<UserNav />);

    await expect.element(screen.getByRole("img")).toBeInTheDocument();
    await expect
      .element(screen.getByRole("link"))
      .toHaveAttribute("href", "/profile");
  });
});
