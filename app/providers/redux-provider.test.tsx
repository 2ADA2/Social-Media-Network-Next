import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import { ReduxProvider } from "./redux-provider";
import { apiClient } from "@/shared/api/api-client";
import updateToken from "@/shared/lib/update-token";
import { useAppSelector } from "@/app/store/hooks";

vi.mock("@/shared/api/api-client", () => ({
  apiClient: { get: vi.fn() },
}));

vi.mock("@/shared/lib/update-token", () => ({
  default: vi.fn(),
}));

vi.mock("@/app/store/hooks", () => ({
  useAppSelector: vi.fn(),
}));

vi.mock("@/entities/user", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/entities/user")>();
  return { ...actual, mapUser: vi.fn() };
});

const TestConsumer = () => {
  return <div data-testid="user">user</div>;
};

describe("ReduxProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  vi.mocked(apiClient.get).mockResolvedValue({
    data: {
      id: 1,
      username: "testuser",
      firstName: "Test",
      secondName: "User",
      email: "test@example.com",
      description: "",
      profileImage: null,
    },
  });

  test("Initializes store without token", async () => {
    const screen = await render(
      <ReduxProvider>
        <TestConsumer />
      </ReduxProvider>,
    );

    await expect.element(screen.getByTestId("user")).toHaveTextContent("Guest");
    expect(updateToken).toHaveBeenCalledWith("");
  });

  test("Fetches user if token exists", async () => {
    localStorage.setItem("token", "mock-token");

    vi.mocked(useAppSelector).mockImplementation((e) => e);

    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        id: 1,
        username: "testuser",
        firstName: "Test",
        secondName: "User",
        email: "test@example.com",
        description: "",
        profileImage: null,
      },
    });

    await render(
      <ReduxProvider>
        <TestConsumer />
      </ReduxProvider>,
    );

    expect(apiClient.get).toHaveBeenCalledWith("/api/me");
    expect(updateToken).toHaveBeenCalledWith("mock-token");
  });

  test("Logs out and removes token if fetch fails", async () => {
    localStorage.setItem("token", "mock-token");
    vi.mocked(apiClient.get).mockRejectedValue(new Error("Network error"));

    const screen = await render(
      <ReduxProvider>
        <TestConsumer />
      </ReduxProvider>,
    );

    expect(localStorage.getItem("token")).toBeNull();
    expect(updateToken).toHaveBeenCalledWith("");
  });
});
