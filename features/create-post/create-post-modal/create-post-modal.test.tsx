import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { CreatePostModal } from './create-post-modal';
import { useCreatePost } from '@/features/create-post/hooks/use-create-post';
import { useNotifications } from '@/app/providers/notifications-provider/useNotifications';
import { createFile } from '@/test/create=file';

let user: ReturnType<typeof userEvent.setup>;

const mockMutate = vi.fn();
const mockAdd = vi.fn();
const mockOnClose = vi.fn();
const mockOnAdd = vi.fn();

vi.mock('@/features/create-post/hooks/use-create-post', () => ({
  useCreatePost: vi.fn(),
}));

vi.mock('@/app/providers/notifications-provider/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

describe('CreatePostModal', () => {
  beforeEach(() => {
    user = userEvent.setup();
    mockMutate.mockReset();
    mockAdd.mockReset();
    mockOnClose.mockReset();
    mockOnAdd.mockReset();

    vi.mocked(useNotifications).mockReturnValue({
      add: mockAdd,
      notifications: [],
    } as unknown as ReturnType<typeof useNotifications>);

    vi.mocked(useCreatePost).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useCreatePost>);
  });

  test('renders modal with fields', async () => {
    const screen = await render(
      <CreatePostModal isOpen onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    await expect
      .element(screen.getByLabelText('createPostModal.title', { exact: false }))
      .toBeVisible();
    await expect
      .element(
        screen.getByRole('textbox', { name: 'createPostModal.titleLabel' }),
      )
      .toBeVisible();
    await expect
      .element(
        screen.getByRole('textbox', {
          name: 'createPostModal.descriptionLabel',
        }),
      )
      .toBeVisible();
    await expect.element(screen.getByTestId('file-input')).toBeInTheDocument();
  });

  test('submits form if valid and calls onAdd on success', async () => {
    mockMutate.mockImplementation((_, opts) => {
      opts.onSuccess({ id: 42 });
    });

    const screen = await render(
      <CreatePostModal isOpen onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    await user.type(
      screen.getByRole('textbox', { name: 'createPostModal.titleLabel' }),
      'My title',
    );
    await user.type(
      screen.getByRole('textbox', { name: 'createPostModal.descriptionLabel' }),
      'My description',
    );

    const pngFile = createFile({
      name: 'image.png',
      sizeInBytes: 1024 * 1024,
      type: 'image/png',
    });

    const fileInput = screen.getByTestId('file-input');
    await user.upload(fileInput, pngFile);

    await user.click(
      screen.getByRole('button', { name: 'createPostModal.submit' }),
    );

    expect(mockMutate).toHaveBeenCalledWith(
      { title: 'My title', content: 'My description', file: pngFile },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );

    expect(mockOnAdd).toHaveBeenCalledWith(42);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockAdd).toHaveBeenCalledWith({
      message: 'createPostModal.success',
    });
  });

  test('shows validation error if empty fields', async () => {
    mockMutate.mockImplementation((_, opts) => {
      opts.onSuccess({ id: 42 });
    });

    const screen = await render(
      <CreatePostModal isOpen onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    await user.click(
      screen.getByRole('button', { name: 'createPostModal.submit' }),
    );

    expect(mockMutate).not.toHaveBeenCalled();
    expect(
      screen.getByText('validation.titleMin', { exact: false }),
    ).toBeVisible();
  });

  test('shows validation error if reached max length', async () => {
    mockMutate.mockImplementation((_, opts) => {
      opts.onSuccess({ id: 42 });
    });

    const screen = await render(
      <CreatePostModal isOpen onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    await screen
      .getByRole('textbox', { name: 'createPostModal.titleLabel' })
      .fill('very long text'.repeat(10));

    await user.click(
      screen.getByRole('button', { name: 'createPostModal.submit' }),
    );

    expect(mockMutate).not.toHaveBeenCalled();
    expect(
      screen.getByText('validation.titleMax', { exact: false }),
    ).toBeVisible();
  });

  test('shows invalid message if file is too big', async () => {
    const screen = await render(
      <CreatePostModal isOpen onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    const bigFile = createFile({
      name: 'big-image.png',
      sizeInBytes: 11 * 1024 * 1024,
      type: 'image/png',
    });

    const fileInput = screen.getByTestId('file-input');
    await user.upload(fileInput, bigFile);

    expect(mockAdd).toHaveBeenCalledWith({
      message: 'createPostModal.fileSizeError',
      type: 'error',
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  test('shows invalid message if file is wrong', async () => {
    const screen = await render(
      <CreatePostModal isOpen onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    const bigFile = createFile({
      name: 'video.mp4',
      sizeInBytes: 1,
    });

    const fileInput = screen.getByTestId('file-input');
    await user.upload(fileInput, bigFile);

    expect(mockAdd).toHaveBeenCalledWith({
      message: 'createPostModal.fileTypeError',
      type: 'error',
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });
});
