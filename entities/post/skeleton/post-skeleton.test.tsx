import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { PostSkeleton } from "./post-skeleton";

describe("PostSkeleton", () => {
  test("Renders skeleton", async () => {
    const screen = await render(<PostSkeleton />);

    await expect
      .element(screen.getByTestId("post-skeleton-text"))
      .toBeVisible();
  });

  test("Does not render image block by default", async () => {
    const screen = await render(<PostSkeleton />);

    await expect
      .element(screen.getByTestId("post-skeleton-image"))
      .not.toBeInTheDocument();
  });

  test("Renders image block when hasImage is true", async () => {
    const screen = await render(<PostSkeleton hasImage />);

    await expect
      .element(screen.getByTestId("post-skeleton-image"))
      .toBeInTheDocument();
  });
});
