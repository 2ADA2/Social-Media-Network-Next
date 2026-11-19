import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { StatsCard } from "./stats-card";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async () => (key: string) => key),
}));

describe("StatsCard", () => {
  test("Shows title, value and positive percents", async () => {
    const element = await StatsCard({ title: "title", value: 5, percents: 10 });
    const screen = await render(element);

    await expect.element(screen.getByText("title")).toBeVisible();
    await expect.element(screen.getByText("5")).toBeVisible();
    await expect
      .element(screen.getByText("+10% stats.weekOverWeek"))
      .toBeVisible();
  });

  test("Shows negative percents", async () => {
    const element = await StatsCard({
      title: "title",
      value: 0,
      percents: -100,
    });
    const screen = await render(element);

    await expect
      .element(screen.getByText("-100% stats.weekOverWeek"))
      .toBeVisible();
  });

  test("Shows zero percents", async () => {
    const element = await StatsCard({ title: "title", value: 0, percents: 0 });
    const screen = await render(element);

    await expect.element(screen.getByText("0")).toBeVisible();
    await expect
      .element(screen.getByText("+0% stats.weekOverWeek"))
      .toBeVisible();
  });
});
