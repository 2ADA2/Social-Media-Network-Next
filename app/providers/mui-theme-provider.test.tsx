import { beforeEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MuiThemeProvider } from "./mui-theme-provider";
import { useTheme } from "@mui/material";
import { useThemeStore } from "../store/theme-store";

const ThemeConsumer = () => {
  const theme = useTheme();

  return (
    <div data-testid="mui-theme-info">
      <span data-testid="palette-mode">{theme.palette.mode}</span>
      <span data-testid="primary-color">{theme.palette.primary.main}</span>
      <span data-testid="breakpoint-md">{theme.breakpoints.values.md}</span>
    </div>
  );
};

describe("MUI theme provider", () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: "light" });
  });

  test("Provides current theme", async () => {
    const screen = await render(
      <MuiThemeProvider>
        <ThemeConsumer />
      </MuiThemeProvider>,
    );

    await expect.element(screen.getByTestId("mui-theme-info")).toBeVisible();
    await expect.element(screen.getByTestId("primary-color")).toBeVisible();
    await expect.element(screen.getByTestId("breakpoint-md")).toBeVisible();
    await expect
      .element(screen.getByTestId("palette-mode"))
      .toHaveTextContent("light");
  });

  test("Provides current theme", async () => {
    const screen = await render(
      <MuiThemeProvider>
        <ThemeConsumer />
      </MuiThemeProvider>,
    );

    await expect
      .element(screen.getByTestId("palette-mode"))
      .toHaveTextContent("light");

    useThemeStore.setState({ theme: "dark" });

    await expect
      .element(screen.getByTestId("palette-mode"))
      .toHaveTextContent("dark");
  });
});
