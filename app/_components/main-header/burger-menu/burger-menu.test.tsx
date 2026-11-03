import { describe, expect, test, vi } from "vitest";
import { BurgerMenu } from ".";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

describe("BurgerMenu", () => {
  test("BurgerMenu is visible", async () => {
    const screen = await render(<BurgerMenu />);

    await expect
      .element(screen.getByRole("button", { name: "nav.menu" }))
      .toBeVisible();
    await expect.element(screen.getByTestId("burger-menu-icon")).toBeVisible();
  });

  test("BurgerMenu is clickable", async () => {
    const onClick = vi.fn();
    const screen = await render(<BurgerMenu onClick={onClick} />);

    await userEvent.click(screen.getByRole("button", { name: "nav.menu" }));
    expect(onClick).toHaveBeenCalled();
  });

  test("doesnt triggers onClick without a click", async () => {
    const onClick = vi.fn();
    await render(<BurgerMenu onClick={onClick} />);

    expect(onClick).not.toHaveBeenCalled();
  });

  test("Has an icon", async () => {
    const onClick = vi.fn();
    const screen = await render(<BurgerMenu onClick={onClick} />);

    await userEvent.click(screen.getByRole("button", { name: "nav.menu" }));
    expect(onClick).toHaveBeenCalled();
  });
});
