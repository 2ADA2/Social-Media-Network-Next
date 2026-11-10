import { beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { Fallback } from ".";
import { renderWithRouter } from "@/test/render-with-router";
import { ROUTES } from "@/app/lib/routes";

describe("Fallback", () => {
  const onReset = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("renders fallback container", async () => {
    const screen = await renderWithRouter(
      <Fallback error={null} onReset={vi.fn()} />,
    );

    await expect.element(screen.getByTestId("fallback")).toBeVisible();
  });

  test("renders back to home link with correct href", async () => {
    const screen = await renderWithRouter(
      <Fallback error={null} onReset={vi.fn()} />,
    );

    await expect
      .element(screen.getByRole("link", { name: "error.backToHome" }))
      .toHaveAttribute("href", ROUTES.HOME);
  });

  test("calls onReset when back to home link is clicked", async () => {
    const user = userEvent.setup();
    const screen = await renderWithRouter(
      <Fallback error={null} onReset={onReset} />,
    );

    const link = screen.getByRole("link", { name: "error.backToHome" });

    link.element().addEventListener("click", (event) => {
      event.preventDefault();
    });

    await user.click(link);

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  test("renders error details when error is provided", async () => {
    const error = new Error("Something broke");
    error.name = "CustomError";

    const screen = await renderWithRouter(
      <Fallback error={error} onReset={vi.fn()} />,
    );

    await expect.element(screen.getByText("CustomError")).toBeInTheDocument();
  });

  test("renders unknown error when error is null", async () => {
    const screen = await renderWithRouter(
      <Fallback error={null} onReset={vi.fn()} />,
    );

    await expect
      .element(screen.getByText("error.unknownError"))
      .toBeInTheDocument();
  });
});
