import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useDeletePost } from '../use-delete-post';
import { render } from 'vitest-browser-react';
import { DeletePostButton } from './delete-post-button';
import { userEvent } from 'vitest/browser';

let mutateFn = vi.fn();
let user = userEvent.setup();

vi.mock('../use-delete-post', async () => ({
  useDeletePost: vi.fn(),
}));

describe('DeletePost button and modal', () => {
  beforeEach(() => {
    user = userEvent.setup();
    mutateFn = vi.fn();
    vi.mocked(useDeletePost).mockReturnValue({
      mutate: mutateFn,
      isPending: false,
    } as unknown as ReturnType<typeof useDeletePost>);
  });

  test('DeletePostButton renders', async () => {
    const screen = await render(<DeletePostButton postId={1} />);
    await expect(screen.getByRole('button', { name: 'post.delete' }));
  });

  test('DeletePostButton shows modal on click', async () => {
    const screen = await render(<DeletePostButton postId={1} />);
    await user.click(screen.getByRole('button', { name: 'post.delete' }));

    await expect(screen.getByRole('dialog')).toBeVisible();
  });

  test('dont triggers if user closes the modal', async () => {
    const screen = await render(<DeletePostButton postId={1} />);
    await user.click(screen.getByRole('button', { name: 'post.delete' }));
    await user.click(screen.getByRole('button', { name: 'modal.close' }));
    await expect(screen.getByRole('dialog')).not.toBeInTheDocument();
    expect(mutateFn).not.toHaveBeenCalledWith(1);
  });

  test('triggers delete on submit', async () => {
    const screen = await render(<DeletePostButton postId={1} />);
    await user.click(screen.getByRole('button', { name: 'post.delete' }));
    await user.click(screen.getByRole('button', { name: 'deletePost.submit' }));
    expect(mutateFn).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );
  });
});
