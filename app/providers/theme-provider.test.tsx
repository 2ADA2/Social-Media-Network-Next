import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { useEffect } from "react";
import { ThemeProvider } from "./theme-provider";
import { useThemeStore } from "../store/theme-store";

const Component = ({ theme = "light" }: { theme?: "light" | "dark" }) => {
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    setTheme(theme);
  }, []);

  return <div data-testid="theme-child">component</div>;
};

describe("theme provider", () => {
  test("Provides current theme", async () => {
    const screen = await render(
      <ThemeProvider>
        <Component />
      </ThemeProvider>,
    );

    await expect.element(screen.getByTestId("theme-child")).toBeVisible();
  });

  test("Provides theme in document", async () => {
    const screen = await render(
      <ThemeProvider>
        <Component />
      </ThemeProvider>,
    );

    expect(document.documentElement.getAttribute("data-theme")).toEqual(
      "light",
    );
  });

  test("Sets theme in document", async () => {
    await render(
      <ThemeProvider>
        <Component />
      </ThemeProvider>,
    );

    expect(document.documentElement.getAttribute("data-theme")).toEqual(
      "light",
    );

    await render(
      <ThemeProvider>
        <Component theme="dark" />
      </ThemeProvider>,
    );

    expect(document.documentElement.getAttribute("data-theme")).toEqual("dark");
  });
});
