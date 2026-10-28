import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { CreateComment } from '.';
import { useCreateComment } from '@/features/create-comment/use-create-comment';
import { useNotifications } from '@/app/providers/notifications-provider/useNotifications';

let user: ReturnType<typeof userEvent.setup>;

const mockMutate = vi.fn();
const mockAdd = vi.fn();

vi.mock('@/features/create-comment/use-create-comment', () => ({
  useCreateComment: vi.fn(),
}));

vi.mock('@/app/providers/notifications-context/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

vi.mock('@/shared/ui/text-area', () => ({
  TextArea: ({
    value,
    onChange,
    errorMessage,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    errorMessage?: string;
  }) => (
    <>
      <textarea data-testid="textarea" value={value} onChange={onChange} />
      {errorMessage && <span data-testid="error">{errorMessage}</span>}
    </>
  ),
}));

vi.mock('@/shared/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button data-testid="submit" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe('CreateComment', () => {
  beforeEach(() => {
    user = userEvent.setup();
    mockMutate.mockReset();
    mockAdd.mockReset();

    vi.mocked(useNotifications).mockReturnValue({
      add: mockAdd,
      notifications: [],
    } as unknown as ReturnType<typeof useNotifications>);

    vi.mocked(useCreateComment).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateComment>);
  });

  test('renders textarea and button', async () => {
    const screen = await render(<CreateComment postId={1} />);

    await expect.element(screen.getByTestId('textarea')).toBeVisible();
    await expect.element(screen.getByTestId('submit')).toBeVisible();
  });

  test('shows error when submitting empty comment', async () => {
    const screen = await render(<CreateComment postId={1} />);

    await screen.getByTestId('submit').click();

    await expect
      .element(screen.getByTestId('error'))
      .toHaveTextContent('comment.lengthError');
    expect(mockMutate).not.toHaveBeenCalled();
  });

  test('shows error when comment exceeds 200 characters', async () => {
    const screen = await render(<CreateComment postId={1} />);

    await screen.getByTestId('textarea').fill('a'.repeat(300));
    await screen.getByTestId('submit').click();

    await expect
      .element(screen.getByTestId('error'))
      .toHaveTextContent('comment.lengthError');
    expect(mockMutate).not.toHaveBeenCalled();
  });

  test('calls mutate with correct params on success', async () => {
    const screen = await render(<CreateComment postId={67} />);

    await user.type(screen.getByTestId('textarea'), 'Hello');
    await screen.getByTestId('submit').click();

    expect(mockMutate).toHaveBeenCalledWith(
      { text: 'Hello', postId: 67 },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
  });

  test('clears textarea and shows success toast on success', async () => {
    mockMutate.mockImplementation((_, options) => {
      options.onSuccess();
    });

    const screen = await render(<CreateComment postId={1} />);

    await user.type(screen.getByTestId('textarea'), 'Hello');
    await screen.getByTestId('submit').click();

    await expect.element(screen.getByTestId('textarea')).toHaveValue('');
    expect(mockAdd).toHaveBeenCalledWith({
      message: 'comment.successMessage',
    });
  });

  test('shows error toast on mutate error', async () => {
    mockMutate.mockImplementation((_, options) => {
      options.onError();
    });

    const screen = await render(<CreateComment postId={1} />);

    await user.type(screen.getByTestId('textarea'), 'Hello');
    await screen.getByTestId('submit').click();

    expect(mockAdd).toHaveBeenCalledWith({
      message: 'comment.errorMessage',
      type: 'error',
    });
  });

  test('disables inputs when isPending', async () => {
    vi.mocked(useCreateComment).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as unknown as ReturnType<typeof useCreateComment>);

    const screen = await render(<CreateComment postId={1} />);

    await expect.element(screen.getByTestId('submit')).toBeDisabled();
  });
});
