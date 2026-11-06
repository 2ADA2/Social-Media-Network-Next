import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MainFooter } from "./";

describe("MainFooter", () => {
  test("renders copyright text", async () => {
    const screen = await render(<MainFooter />);

    await expect
      .element(screen.getByText(/© 2026 Sidekick/i))
      .toBeInTheDocument();
  });

  test("renders as footer landmark", async () => {
    const screen = await render(<MainFooter />);

    await expect.element(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
