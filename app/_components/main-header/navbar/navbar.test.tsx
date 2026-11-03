import { beforeEach, describe, expect, test, vi } from "vitest";
import { NavBar } from ".";
import { useAuth } from "@/features/auth/use-auth";
import { useUser } from "@/entities/user/model/use-user";
import { userEvent } from "vitest/browser";
import { authed, authUser, type UseAuthType } from "@/test/mock-hooks";
import { renderWithRouter } from "@/test/render-with-router";

vi.mock("@/features/auth/use-auth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/entities/user/model/use-user", () => ({
  useUser: vi.fn(),
}));

describe("NavBar", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({ isAuth: false } as UseAuthType);
    vi.mocked(useUser).mockReturnValue({ user: null, setUser: vi.fn() });
    user = userEvent.setup();
  });

  test("renders when isOpen=true", async () => {
    const setNavBar = vi.fn();
    const screen = await renderWithRouter(
      <NavBar setNavBar={setNavBar} isOpen={true}></NavBar>,
    );

    await expect.element(screen.getByRole("dialog")).toBeVisible();
  });

  test("doesnt render when isOpen=false", async () => {
    const setNavBar = vi.fn();
    const screen = await renderWithRouter(
      <NavBar setNavBar={setNavBar} isOpen={false}></NavBar>,
    );

    await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
  });

  test("renders sign in / sign up buttons when not authenticated", async () => {
    const setNavBar = vi.fn();
    const screen = await renderWithRouter(
      <NavBar setNavBar={setNavBar} isOpen={true}></NavBar>,
    );

    await expect
      .element(screen.getByRole("link", { name: "nav.signIn" }))
      .toBeVisible();
    await expect
      .element(screen.getByRole("link", { name: "nav.signUp" }))
      .toBeVisible();
  });

  test("renders profile / settings buttons when authenticated", async () => {
    vi.mocked(useAuth).mockReturnValue(authed);
    vi.mocked(useUser).mockReturnValue(authUser);
    const setNavBar = vi.fn();
    const screen = await renderWithRouter(
      <NavBar setNavBar={setNavBar} isOpen={true}></NavBar>,
    );

    await expect
      .element(screen.getByRole("link", { name: "nav.profile" }))
      .toBeVisible();
    await expect
      .element(screen.getByRole("link", { name: "nav.statistics" }))
      .toBeVisible();
  });

  test("click on nav-background triggers setNavBar", async () => {
    const setNavBar = vi.fn();
    const screen = await renderWithRouter(
      <NavBar setNavBar={setNavBar} isOpen={true}></NavBar>,
    );

    (screen.getByTestId("nav-background").element() as HTMLElement).click();
    expect(setNavBar).toHaveBeenCalled();
  });

  test("Escape triggers setNavBar", async () => {
    const setNavBar = vi.fn();
    await renderWithRouter(
      <NavBar setNavBar={setNavBar} isOpen={true}></NavBar>,
    );

    await user.keyboard("{Escape}");
    expect(setNavBar).toHaveBeenCalled();
  });

  test("click on close button triggers setNavBar", async () => {
    const setNavBar = vi.fn();
    const screen = await renderWithRouter(
      <NavBar setNavBar={setNavBar} isOpen={true}></NavBar>,
    );

    await user.click(screen.getByRole("button", { name: "navbar.close" }));
    expect(setNavBar).toHaveBeenCalled();
  });

  test("doesnt trigger setNvBar if isOpen=false", async () => {
    const setNavBar = vi.fn();
    await renderWithRouter(
      <NavBar setNavBar={setNavBar} isOpen={false}></NavBar>,
    );

    await user.keyboard("{Escape}");
    expect(setNavBar).not.toHaveBeenCalled();
  });

  test("adds and removes event listener", async () => {
    const addSpy = vi.spyOn(document, "addEventListener");
    const removeSpy = vi.spyOn(document, "removeEventListener");

    const setNavBar = vi.fn();
    const screen = await renderWithRouter(
      <NavBar setNavBar={setNavBar} isOpen />,
    );
    expect(addSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

    screen.unmount();
    expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
