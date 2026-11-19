import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { PostImage } from "./post-image";

describe("PostImage", () => {
  test("Renders image with provided src", async () => {
    const screen = await render(
      <PostImage src="/image.jpg" alt="Test image" />,
    );

    const image = screen.getByTestId("image");
    await expect.element(image).toHaveAttribute("src", "/image.jpg");
    await expect.element(image).toHaveAttribute("alt", "Test image");
  });

  test("Replaces src with default image on error", async () => {
    const screen = await render(
      <PostImage src="/image.jpg" alt="Test image" />,
    );

    const image = screen.getByTestId("image");
    await expect.element(image).toHaveAttribute("src", "/image.jpg");

    await image.element().dispatchEvent(new Event("error"));

    await expect
      .element(screen.getByTestId("image"))
      .toHaveAttribute("src", "/assets/default-image.png");
  });

  test("Passes width and height props", async () => {
    const screen = await render(
      <PostImage src="/image.jpg" alt="Test image" width={800} height={600} />,
    );

    const image = screen.getByTestId("image");
    await expect.element(image).toHaveAttribute("width", "800");
    await expect.element(image).toHaveAttribute("height", "600");
  });

  test("Passes loading prop", async () => {
    const screen = await render(
      <PostImage src="/image.jpg" alt="Test image" loading="eager" />,
    );

    const image = screen.getByTestId("image");
    await expect.element(image).toHaveAttribute("loading", "eager");
  });

  test("Passes className prop", async () => {
    const screen = await render(
      <PostImage src="/image.jpg" alt="Test image" className="custom-class" />,
    );

    const image = screen.getByTestId("image");
    await expect.element(image).toHaveClass("custom-class");
  });
});
