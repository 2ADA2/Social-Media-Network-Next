import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Loader } from ".";

describe("Loader", () => {
  test("Renders without props", async () => {
    const screen = await render(<Loader />);

    await expect.element(screen.getByTestId("loader")).toBeVisible();
  });

  test("Renders if isBlock=true", async () => {
    const screen = await render(<Loader isBlock={true} />);

    await expect.element(screen.getByTestId("loader")).toBeVisible();
  });

  test("Renders if isBlock=false", async () => {
    const screen = await render(<Loader isBlock={false} />);

    await expect.element(screen.getByTestId("loader")).toBeVisible();
    await expect
      .element(screen.getByTestId("loader"))
      .toHaveAttribute("aria-label", "Loading");
  });
});
