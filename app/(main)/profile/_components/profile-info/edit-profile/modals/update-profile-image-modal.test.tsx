import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { UpdateProfileImageModal } from './update-profile-image-modal';
import { useUpdateAvatar } from '@/features/edit-profile/use-update-avatar';
import { useNotifications } from '@/app/providers/notifications-context/useNotifications';
import { createFile } from '@/test/create=file';

let user = userEvent.setup();

const mockMutate = vi.fn();
const mockAdd = vi.fn();
const mockOnClose = vi.fn();

vi.mock('@/features/edit-profile/use-update-avatar', () => ({
  useUpdateAvatar: vi.fn(),
}));

vi.mock('@/app/providers/notifications-context/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

describe('UpdateProfileImageModal', () => {
  beforeEach(() => {
    user = userEvent.setup();
    mockMutate.mockReset();
    mockAdd.mockReset();
    mockOnClose.mockReset();

    vi.mocked(useUpdateAvatar).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateAvatar>);

    vi.mocked(useNotifications).mockReturnValue({
      add: mockAdd,
      notifications: [],
    } as unknown as ReturnType<typeof useNotifications>);
  });

  const renderModal = () =>
    render(<UpdateProfileImageModal isOpen onClose={mockOnClose} />);

  test('Updates avatar and closes modal if valid', async () => {
    mockMutate.mockImplementation((_, opts) => opts.onSuccess());

    const screen = await renderModal();

    const file = createFile({
      name: 'avatar.png',
      type: 'image/png',
      sizeInBytes: 1024,
    });
    await user.upload(screen.getByTestId('file-input'), file);

    await user.click(
      screen.getByRole('button', { name: 'updateAvatar.submit' }),
    );

    expect(mockMutate).toHaveBeenCalledWith(
      file,
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
    expect(mockAdd).toHaveBeenCalledWith({
      message: 'updateAvatar.success',
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('Shows error if invalid', async () => {
    const screen = await renderModal();

    const file = createFile({
      name: 'document.txt',
      type: 'text/plain',
      sizeInBytes: 1024,
    });
    await user.upload(screen.getByTestId('file-input'), file);

    expect(mockAdd).toHaveBeenCalledWith({
      message: 'updateAvatar.fileTypeError',
      type: 'error',
    });
    expect(mockMutate).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
