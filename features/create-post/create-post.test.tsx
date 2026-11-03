import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { CreatePost } from '.';
import { useAuth } from '@/features/auth/use-auth';
import { useUser } from '@/entities/user/model/use-user';
import { useModal } from '@/shared/lib/hooks/use-modal';
import { authed, authUser } from '@/test/mock-hooks';

const mockOpen = vi.fn();
const mockClose = vi.fn();
const mockOnAdd = vi.fn();

vi.mock('@/features/auth/use-auth', () => ({ useAuth: vi.fn() }));
vi.mock('@/entities/user/model/use-user', () => ({ useUser: vi.fn() }));
vi.mock('@/shared/lib/hooks/use-modal', () => ({ useModal: vi.fn() }));

vi.mock(
  '@/features/create-post/create-post-modal/create-post-modal.tsx',
  () => ({
    CreatePostModal: ({
      isOpen,
      onClose,
      onAdd,
    }: {
      isOpen: boolean;
      onClose: () => void;
      onAdd: (id: number) => void;
    }) => (
      <div data-testid="modal" data-open={isOpen}>
        <button data-testid="modal-close" onClick={onClose} />
        <button data-testid="modal-add" onClick={() => onAdd(42)} />
      </div>
    ),
  }),
);

vi.mock('@/shared/assets/icons/user.svg?react', () => ({
  default: () => null,
}));

describe('CreatePost', () => {
  beforeEach(() => {
    mockOpen.mockReset();
    mockClose.mockReset();
    mockOnAdd.mockReset();

    vi.mocked(useAuth).mockReturnValue(authed);
    vi.mocked(useUser).mockReturnValue(authUser);
    vi.mocked(useModal).mockReturnValue({
      isOpen: false,
      open: mockOpen,
      close: mockClose,
    });
  });

  test('does not render when not authenticated', async () => {
    vi.mocked(useAuth).mockReturnValue({ isAuth: false } as ReturnType<
      typeof useAuth
    >);
    const screen = await render(<CreatePost onAdd={mockOnAdd} />);
    expect(screen.getByTestId('modal').query()).toBeNull();
  });

  test('opens modal when clicking button', async () => {
    const screen = await render(<CreatePost onAdd={mockOnAdd} />);
    await screen.getByRole('button', { name: 'createPost.submit' }).click();
    expect(mockOpen).toHaveBeenCalledTimes(1);
  });

  test('passes isOpen and close to modal', async () => {
    vi.mocked(useModal).mockReturnValue({
      isOpen: true,
      open: mockOpen,
      close: mockClose,
    });
    const screen = await render(<CreatePost onAdd={mockOnAdd} />);
    await expect
      .element(screen.getByTestId('modal'))
      .toHaveAttribute('data-open', 'true');
    await screen.getByTestId('modal-close').click();
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  test('passes onAdd to modal', async () => {
    vi.mocked(useModal).mockReturnValue({
      isOpen: true,
      open: mockOpen,
      close: mockClose,
    });
    const screen = await render(<CreatePost onAdd={mockOnAdd} />);
    await screen.getByTestId('modal-add').click();
    expect(mockOnAdd).toHaveBeenCalledWith(42);
  });
});
