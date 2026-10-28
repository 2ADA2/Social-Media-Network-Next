import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { AxiosError, type AxiosResponse } from 'axios';
import { ConfirmPasswordModal } from './confirm-password-modal';
import { useUpdateAccount } from '@/features/edit-profile/use-update-account';
import { useNotifications } from '@/app/providers/notifications-context/useNotifications';

let user = userEvent.setup();

const mockMutate = vi.fn();
const mockAdd = vi.fn();
const mockOnClose = vi.fn();
const mockOnSuccess = vi.fn();

vi.mock('@/features/edit-profile/use-update-account', () => ({
  useUpdateAccount: vi.fn(),
}));

vi.mock('@/app/providers/notifications-context/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

describe('ConfirmPasswordModal', () => {
  beforeEach(() => {
    user = userEvent.setup();
    mockMutate.mockReset();
    mockAdd.mockReset();
    mockOnClose.mockReset();
    mockOnSuccess.mockReset();

    vi.mocked(useUpdateAccount).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateAccount>);

    vi.mocked(useNotifications).mockReturnValue({
      add: mockAdd,
      notifications: [],
    } as unknown as ReturnType<typeof useNotifications>);
  });

  const renderModal = () =>
    render(
      <ConfirmPasswordModal
        isOpen
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        newEmail="new@social.com"
      />,
    );

  test('Updates email and closes modal if ok', async () => {
    mockMutate.mockImplementation((_, opts) => opts.onSuccess());

    const screen = await renderModal();

    await user.type(
      screen.getByPlaceholder('confirmPassword.passwordPlaceholder'),
      'password123',
    );

    await user.click(
      screen.getByRole('button', { name: 'confirmPassword.submit' }),
    );

    expect(mockMutate).toHaveBeenCalledWith(
      { currentPassword: 'password123', email: 'new@social.com' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockAdd).toHaveBeenCalledWith({
      message: 'editProfile.emailSuccess',
    });
  });

  test('Shows error if 403', async () => {
    const error = new AxiosError(
      'Forbidden',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 403,
      } as AxiosResponse,
    );

    mockMutate.mockImplementation((_, opts) => {
      opts.onError(error);
    });

    const screen = await renderModal();

    await user.type(
      screen.getByPlaceholder('confirmPassword.passwordPlaceholder'),
      'password',
    );

    await user.click(
      screen.getByRole('button', { name: 'confirmPassword.submit' }),
    );

    expect(mockAdd).toHaveBeenCalledWith({
      message: 'confirmPassword.wrongPassword',
      type: 'error',
    });
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
