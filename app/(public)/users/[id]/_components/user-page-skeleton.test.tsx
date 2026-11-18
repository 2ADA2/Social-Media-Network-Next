import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { UserPageSkeleton } from "./user-page-skeleton";

describe("UserPageSkeleton", () => {
  test("Renders skeleton", async () => {
    const screen = await render(<UserPageSkeleton />);

    await expect
      .element(screen.getByTestId("user-page-skeleton"))
      .toBeVisible();
  });
});
