import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import NotFound from "./not-found";

describe("Not found page", () => {
  test("Not found page renders", async () => {
    const screen = await render(<NotFound />);

    const svg = screen.container.querySelector("svg");

    await expect.element(svg).toBeVisible();
  });
});
