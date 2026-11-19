import { describe, expect, test, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";
import { Statistics } from ".";
import { StatisticsClient } from "./statistics-client";
import {
  fetchMyPosts,
  fetchMyLikes,
  fetchMyComments,
} from "@/features/get-statistics/stats";

let user = userEvent.setup();

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async () => (key: string) => key),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/features/get-statistics/stats", () => ({
  fetchMyPosts: vi.fn(),
  fetchMyLikes: vi.fn(),
  fetchMyComments: vi.fn(),
}));

vi.mock("@/shared/lib/stats/date-stats", () => ({
  countByWeek: vi.fn(() => ({ current: 5, percents: 10 })),
}));

vi.mock("@/shared/lib/stats/count-by-day", () => ({
  countByDay: vi.fn(() => []),
}));

vi.mock("./stats-card", () => ({
  StatsCard: ({ title, value }: { title: string; value: number }) => (
    <div data-testid="stats-card">
      {title}: {value}
    </div>
  ),
}));

vi.mock("./table-view", () => ({
  TableView: () => <div data-testid="table-view">Table View</div>,
}));

vi.mock("./chart-view", () => ({
  default: () => <div data-testid="chart-view">Chart View</div>,
}));

vi.mock("@/shared/ui/loader", () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock("@/app/store/theme-store", () => ({
  useThemeStore: (selector: (state: { theme: string }) => string) =>
    selector({ theme: "light" }),
}));

describe("Statistics", () => {
  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();

    vi.mocked(fetchMyPosts).mockResolvedValue([
      { creationDate: "2024-01-01" },
    ] as unknown as Awaited<ReturnType<typeof fetchMyPosts>>);

    vi.mocked(fetchMyLikes).mockResolvedValue([
      { creationDate: "2024-01-02" },
    ] as unknown as Awaited<ReturnType<typeof fetchMyLikes>>);

    vi.mocked(fetchMyComments).mockResolvedValue([
      { creationDate: "2024-01-03" },
    ] as unknown as Awaited<ReturnType<typeof fetchMyComments>>);
  });

  test("Renders stats cards", async () => {
    const element = await Statistics();
    const screen = await render(element);

    await expect.element(screen.getByText("stats.likes: 5")).toBeVisible();
    await expect.element(screen.getByText("stats.comments: 5")).toBeVisible();
    await expect.element(screen.getByText("stats.posts: 5")).toBeVisible();
  });

  test("Click on toggle switches view", async () => {
    const screen = await render(
      <StatisticsClient likesByDay={[]} commentsByDay={[]} />,
    );

    await expect.element(screen.getByTestId("table-view")).toBeVisible();
    await expect
      .element(screen.getByTestId("chart-view"))
      .not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "stats.switchView" }));

    await expect
      .element(screen.getByTestId("table-view"))
      .not.toBeInTheDocument();
    await expect.element(screen.getByTestId("chart-view")).toBeVisible();
  });
});
