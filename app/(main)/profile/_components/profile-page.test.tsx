import { describe, expect, test, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import ProfilePage from "./profile-page";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
  useRouter,
} from "next/navigation";
import { userEvent } from "vitest/browser";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const mockReplace = vi.fn();

vi.mock("next/navigation", async () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

const StatisticsPage = () => {
  return <div>stats</div>;
};

const InfoPage = () => {
  return <div>info</div>;
};

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn(),
    } as unknown as ReadonlyURLSearchParams);
    vi.mocked(useRouter).mockReturnValue({
      replace: mockReplace,
    } as unknown as AppRouterInstance);
  });
  test("renders first page as default", async () => {
    const screen = await render(
      <ProfilePage
        ProfileInfo={<InfoPage />}
        Statistics={<StatisticsPage />}
      />,
    );

    await expect.element(screen.getByText("info")).toBeVisible();
    await expect.element(screen.getByText("stats")).not.toBeInTheDocument();
  });

  test("renders stats page if stats in search params", async () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: () => "stats",
    } as unknown as ReadonlyURLSearchParams);
    const screen = await render(
      <ProfilePage
        ProfileInfo={<InfoPage />}
        Statistics={<StatisticsPage />}
      />,
    );

    await expect.element(screen.getByText("stats")).toBeVisible();
    await expect.element(screen.getByText("info")).not.toBeInTheDocument();
  });

  test("triggers router replace on tab click", async () => {
    const user = userEvent.setup();
    const screen = await render(
      <ProfilePage
        ProfileInfo={<InfoPage />}
        Statistics={<StatisticsPage />}
      />,
    );

    await user.click(screen.getByTestId("tab").first());

    expect(mockReplace).toHaveBeenCalled();
  });
});
