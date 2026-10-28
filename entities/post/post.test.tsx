import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { Post } from '.';
import type { Post as PostType } from './types';

const mockLike = vi.fn();

vi.mock('@/features/auth/use-auth', () => ({
  useAuth: () => ({ isAuth: true }),
}));

vi.mock('@/app/store/hooks', () => ({
  useAppSelector: () => 1,
}));

vi.mock('@/entities/user/model/selectors', () => ({
  selectUserId: () => 1,
}));

vi.mock('@/features/like-post/use-like-post', () => ({
  useLikePost: () => ({ mutate: mockLike, isPending: false }),
}));

vi.mock('@/entities/post/post-comments', () => ({
  PostComments: ({ postId }: { postId: number }) => (
    <div data-testid="post-comments">Comments for {postId}</div>
  ),
}));

vi.mock('@/features/delete-post', () => ({
  DeletePostButton: ({ postId }: { postId: number }) => (
    <button data-testid="delete-post">Delete {postId}</button>
  ),
}));

vi.mock('@/shared/lib/localization/format-number', () => ({
  formatCompact: (n: number) => String(n),
}));

vi.mock('@/shared/lib/localization/format-relative-time.ts', () => ({
  formatRelativeTime: () => '2 hours ago',
}));

const createPost = (overrides: Partial<PostType> = {}): PostType => ({
  id: 1,
  title: 'Title',
  content: 'Content',
  image: null,
  authorId: 1,
  likesCount: 5,
  commentsCount: 3,
  creationDate: '2026-10-18T10:00:00Z',
  modifiedDate: '2026-10-18T10:00:00Z',
  author: {
    id: 1,
    username: 'alice',
    firstName: 'Alice',
    secondName: 'Smith',
    profileImage: '/avatar.png',
  },
  likedByUsers: [],
  ...overrides,
});

describe('Post', () => {
  beforeEach(() => {
    mockLike.mockReset();
  });

  test('renders author name', async () => {
    const screen = await render(<Post post={createPost()} />);

    await expect.element(screen.getByText('Alice Smith')).toBeVisible();
  });

  test('renders post content', async () => {
    const screen = await render(<Post post={createPost()} />);

    await expect.element(screen.getByText('Content')).toBeVisible();
  });

  test('renders image when post.image is set', async () => {
    const screen = await render(
      <Post post={createPost({ image: '/img.png' })} />,
    );

    await expect
      .element(screen.getByRole('img', { name: 'Title' }))
      .toHaveAttribute('src', '/img.png');
  });

  test('does not render image when post.image is null', async () => {
    const screen = await render(<Post post={createPost({ image: null })} />);

    await expect.element(screen.getByRole('img', { name: 'Title' })).not
      .toBeInTheDocument;
  });

  test('calls like when clicking like button', async () => {
    const screen = await render(<Post post={createPost()} />);

    await screen.getByRole('button', { name: 'post.likeButton' }).click();

    expect(mockLike).toHaveBeenCalledWith({ postId: 1, liked: false });
  });

  test('renders delete button for own post', async () => {
    const screen = await render(<Post post={createPost()} />);

    await expect.element(screen.getByTestId('delete-post')).toBeVisible();
  });

  test('does not render delete button for other post', async () => {
    const screen = await render(<Post post={createPost({ authorId: 999 })} />);

    await expect.element(screen.getByTestId('delete-post')).not
      .toBeInTheDocument;
  });

  test('does not show comments by default', async () => {
    const screen = await render(<Post post={createPost()} />);

    await expect.element(screen.getByTestId('post-comments')).not
      .toBeInTheDocument;
  });

  test('shows comments when clicking comments button', async () => {
    const screen = await render(<Post post={createPost()} />);

    await screen.getByRole('button', { name: 'post.commentsButton' }).click();

    await expect.element(screen.getByTestId('post-comments')).toBeVisible();
  });

  test('shows relative date', async () => {
    const screen = await render(<Post post={createPost()} />);

    await expect.element(screen.getByText('2 hours ago')).toBeVisible();
  });
});
