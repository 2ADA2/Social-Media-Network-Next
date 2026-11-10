import { describe, expect, test } from "vitest";
import { AuthButtons } from "./";
import { ROUTES } from "@/app/lib/routes";
import { renderWithRouter } from "@/test/render-with-router";

describe("AuthButtons", () => {
  test("renders sign in link", async () => {
    const screen = await renderWithRouter(<AuthButtons />);

    const link = screen.getByRole("link", { name: "nav.signIn" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", ROUTES.SIGNIN);
  });

  test("renders sign up link", async () => {
    const screen = await renderWithRouter(<AuthButtons />);

    const link = screen.getByRole("link", { name: "nav.signUp" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", ROUTES.SIGNUP);
  });

  test("renders navigation landmark", async () => {
    const screen = await renderWithRouter(<AuthButtons />);

    await expect.element(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
