import { describe, expect, test, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";
import { AxiosError, type AxiosResponse } from "axios";
import { ConfirmPasswordModal } from "./confirm-password-modal";
import { updateAccountRequest } from "@/features/edit-profile/update-account";
import { useNotifications } from "@/app/providers/notifications-provider/useNotifications";
import { QueryProvider } from "@/app/providers/query-provider";

let user = userEvent.setup();

const mockAdd = vi.fn();
const mockOnClose = vi.fn();
const mockOnSuccess = vi.fn();

vi.mock("@/app/store/hooks", async () => ({
  useAppDispatch: () => vi.fn(),
}));

vi.mock("@/features/edit-profile/update-account", () => ({
  updateAccountRequest: vi.fn(),
}));

vi.mock("@/app/providers/notifications-provider/useNotifications", () => ({
  useNotifications: vi.fn(),
}));

describe("ConfirmPasswordModal", () => {
  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();

    vi.mocked(useNotifications).mockReturnValue({
      add: mockAdd,
      notifications: [],
    } as unknown as ReturnType<typeof useNotifications>);
  });

  const renderModal = () =>
    render(
      <QueryProvider>
        <ConfirmPasswordModal
          isOpen
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          newEmail="new@social.com"
        />
      </QueryProvider>,
    );

  const submitWithPassword = async (
    screen: Awaited<ReturnType<typeof renderModal>>,
    password: string,
  ) => {
    await user.type(
      screen.getByPlaceholder("confirmPassword.passwordPlaceholder"),
      password,
    );
    await user.click(
      screen.getByRole("button", { name: "confirmPassword.submit" }),
    );
  };

  test("Shows error if password is empty", async () => {
    const screen = await renderModal();

    await user.click(
      screen.getByRole("button", { name: "confirmPassword.submit" }),
    );

    expect(mockAdd).toHaveBeenCalledWith({
      message: "confirmPassword.required",
      type: "error",
    });
    expect(updateAccountRequest).not.toHaveBeenCalled();
  });

  test("Updates email and closes modal if ok", async () => {
    vi.mocked(updateAccountRequest).mockResolvedValue({
      message: "ok",
      user: {
        id: 1,
        username: "test",
        email: "new@social.com",
        profileImage: "https://example.com/avatar.jpg",
        bio: "Bio",
        firstName: "Test",
        secondName: "User",
        description: "Description",
        lastLogin: "2026-01-01",
        creationDate: "2026-01-01",
        modifiedDate: "2026-01-01",
      },
    });

    const screen = await renderModal();
    await submitWithPassword(screen, "password123");

    await vi.waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    expect(updateAccountRequest).toHaveBeenCalledWith(
      {
        currentPassword: "password123",
        email: "new@social.com",
      },
      expect.anything(),
    );
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockAdd).toHaveBeenCalledWith({
      message: "editProfile.emailSuccess",
    });
  });

  test("Shows error if 403", async () => {
    const error = new AxiosError(
      "Forbidden",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      { status: 403 } as AxiosResponse,
    );

    vi.mocked(updateAccountRequest).mockRejectedValue(error);

    const screen = await renderModal();
    await submitWithPassword(screen, "password");

    await vi.waitFor(() => {
      expect(mockAdd).toHaveBeenCalledWith({
        message: "confirmPassword.wrongPassword",
        type: "error",
      });
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("Shows error if INVALID_CURRENT_PASSWORD code", async () => {
    const error = new AxiosError(
      "Bad Request",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        status: 400,
        data: { code: "INVALID_CURRENT_PASSWORD" },
      } as AxiosResponse,
    );

    vi.mocked(updateAccountRequest).mockRejectedValue(error);

    const screen = await renderModal();
    await submitWithPassword(screen, "password");

    await vi.waitFor(() => {
      expect(mockAdd).toHaveBeenCalledWith({
        message: "confirmPassword.wrongPassword",
        type: "error",
      });
    });
  });

  test("Shows error if 409", async () => {
    const error = new AxiosError(
      "Conflict",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      { status: 409 } as AxiosResponse,
    );

    vi.mocked(updateAccountRequest).mockRejectedValue(error);

    const screen = await renderModal();
    await submitWithPassword(screen, "password");

    await vi.waitFor(() => {
      expect(mockAdd).toHaveBeenCalledWith({
        message: "confirmPassword.emailTaken",
        type: "error",
      });
    });
  });

  test("Shows error if EMAIL_TAKEN code", async () => {
    const error = new AxiosError(
      "Conflict",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        status: 400,
        data: { code: "EMAIL_TAKEN" },
      } as AxiosResponse,
    );

    vi.mocked(updateAccountRequest).mockRejectedValue(error);

    const screen = await renderModal();
    await submitWithPassword(screen, "password");

    await vi.waitFor(() => {
      expect(mockAdd).toHaveBeenCalledWith({
        message: "confirmPassword.emailTaken",
        type: "error",
      });
    });
  });

  test("Shows error if 400 with server message", async () => {
    const error = new AxiosError(
      "Bad Request",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        status: 400,
        data: { code: "VALIDATION_FAILED", message: "Custom server error" },
      } as AxiosResponse,
    );

    vi.mocked(updateAccountRequest).mockRejectedValue(error);

    const screen = await renderModal();
    await submitWithPassword(screen, "password");

    await vi.waitFor(() => {
      expect(mockAdd).toHaveBeenCalledWith({
        message: "Custom server error",
        type: "error",
      });
    });
  });

  test("Shows default validation error if 400 without server message", async () => {
    const error = new AxiosError(
      "Bad Request",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        status: 400,
        data: { code: "VALIDATION_FAILED" },
      } as AxiosResponse,
    );

    vi.mocked(updateAccountRequest).mockRejectedValue(error);

    const screen = await renderModal();
    await submitWithPassword(screen, "password");

    await vi.waitFor(() => {
      expect(mockAdd).toHaveBeenCalledWith({
        message: "confirmPassword.validationError",
        type: "error",
      });
    });
  });

  test("Shows generic error for unknown Axios error", async () => {
    const error = new AxiosError(
      "Server Error",
      "ERR_BAD_RESPONSE",
      undefined,
      undefined,
      {
        status: 500,
        data: { message: "Server exploded" },
      } as AxiosResponse,
    );

    vi.mocked(updateAccountRequest).mockRejectedValue(error);

    const screen = await renderModal();
    await submitWithPassword(screen, "password");

    await vi.waitFor(() => {
      expect(mockAdd).toHaveBeenCalledWith({
        message: "Server exploded",
        type: "error",
      });
    });
  });

  test("Shows generic error if not AxiosError", async () => {
    vi.mocked(updateAccountRequest).mockRejectedValue(
      new Error("Something went wrong"),
    );

    const screen = await renderModal();
    await submitWithPassword(screen, "password");

    await vi.waitFor(() => {
      expect(mockAdd).toHaveBeenCalledWith({
        message: expect.stringContaining("editProfile.error"),
        type: "error",
      });
    });
  });
});
