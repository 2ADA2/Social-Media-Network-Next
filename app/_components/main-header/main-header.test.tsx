import { renderWithRouter } from "@/test/render-with-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { MainHeader } from ".";
import { useAuth } from "@/features/auth/use-auth";
import {
  authed,
  authUser,
  nullUser,
  type UseAuthType,
} from "@/test/mock-hooks";
import { useUser } from "@/entities/user/model/use-user";
import { page, userEvent } from "vitest/browser";

vi.mock("@/features/auth/use-auth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/entities/user/model/use-user", () => ({
  useUser: vi.fn(),
}));

describe("Header component", () => {
  describe("Header for authed", () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue(authed);
      vi.mocked(useUser).mockReturnValue(authUser);
    });

    test("renders for desktop", async () => {
      await page.viewport(1920, 1080);
      const screen = await renderWithRouter(<MainHeader />);

      await expect.element(screen.getByTestId("user-nav")).toBeVisible();
    });

    test("renders for desktop hiddenNav=true", async () => {
      await page.viewport(1920, 1080);
      const screen = await renderWithRouter(<MainHeader hiddenNav />);

      await expect
        .element(screen.getByTestId("user-nav"))
        .not.toBeInTheDocument();
    });

    test("renders for mobile", async () => {
      await page.viewport(320, 1000);
      const screen = await renderWithRouter(<MainHeader />);

      await expect
        .element(screen.getByRole("button", { name: "nav.menu" }))
        .toBeVisible();
    });

    test("renders for mobile hiddenNav=true", async () => {
      await page.viewport(320, 1000);
      const screen = await renderWithRouter(<MainHeader hiddenNav />);

      await expect
        .element(screen.getByRole("button", { name: "nav.menu" }))
        .not.toBeInTheDocument();
    });

    test("burger menu on click shows dialog", async () => {
      await page.viewport(320, 1000);
      const user = userEvent.setup();
      const screen = await renderWithRouter(<MainHeader />);

      await user.click(screen.getByTestId("burger-menu"));

      await expect.element(screen.getByTestId("navbar")).toBeInTheDocument();
    });

    test("dialog provides profile and stats links", async () => {
      await page.viewport(320, 1000);
      const user = userEvent.setup();
      const screen = await renderWithRouter(<MainHeader />);

      await user.click(screen.getByRole("button", { name: "nav.menu" }));

      await expect(
        screen.getByRole("link", { name: "nav.profile" }),
      ).toBeVisible();
      await expect(
        screen.getByRole("link", { name: "nav.statistics" }),
      ).toBeVisible();
    });

    test("shows dialog and closes", async () => {
      await page.viewport(320, 1000);
      const user = userEvent.setup();
      const screen = await renderWithRouter(<MainHeader />);

      await user.click(screen.getByRole("button", { name: "nav.menu" }));

      await expect(screen.getByRole("dialog")).toBeVisible();

      await user.click(screen.getByRole("button", { name: "navbar.close" }));

      await expect(screen.getByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Header for not authed", () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({ isAuth: false } as UseAuthType);
      vi.mocked(useUser).mockReturnValue(nullUser);
    });

    test("renders for desktop", async () => {
      await page.viewport(1920, 1080);
      const screen = await renderWithRouter(<MainHeader />);

      await expect(
        screen.getByRole("link", { name: "nav.signIn" }),
      ).toBeVisible();
      await expect(
        screen.getByRole("link", { name: "nav.signUp" }),
      ).toBeVisible();
    });

    test("renders for desktop hiddenNav=true", async () => {
      await page.viewport(1920, 1080);
      const screen = await renderWithRouter(<MainHeader hiddenNav />);

      await expect
        .element(screen.getByTestId("user-nav"))
        .not.toBeInTheDocument();
    });

    test("renders for mobile", async () => {
      await page.viewport(320, 1000);
      const screen = await renderWithRouter(<MainHeader />);

      await expect
        .element(screen.getByRole("button", { name: "nav.menu" }))
        .toBeVisible();
    });

    test("renders for mobile hiddenNav=true", async () => {
      await page.viewport(320, 1000);
      const screen = await renderWithRouter(<MainHeader hiddenNav />);

      await expect
        .element(screen.getByRole("button", { name: "nav.menu" }))
        .not.toBeInTheDocument();
    });

    test("burger menu on click shows dialog", async () => {
      await page.viewport(320, 1000);
      const user = userEvent.setup();
      const screen = await renderWithRouter(<MainHeader />);

      await user.click(screen.getByRole("button", { name: "nav.menu" }));

      await expect(screen.getByRole("dialog")).toBeVisible();
    });

    test("dialog provides sign in and sign up links", async () => {
      await page.viewport(320, 1000);
      const user = userEvent.setup();
      const screen = await renderWithRouter(<MainHeader />);

      await user.click(screen.getByRole("button", { name: "nav.menu" }));

      await expect(
        screen.getByRole("link", { name: "nav.signIn" }),
      ).toBeVisible();
      await expect(
        screen.getByRole("link", { name: "nav.signUp" }),
      ).toBeVisible();
    });

    test("shows dialog and closes", async () => {
      await page.viewport(320, 1000);
      const user = userEvent.setup();
      const screen = await renderWithRouter(<MainHeader />);

      await user.click(screen.getByRole("button", { name: "nav.menu" }));

      await expect(screen.getByRole("dialog")).toBeVisible();

      await user.click(screen.getByRole("button", { name: "navbar.close" }));

      await expect(screen.getByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
