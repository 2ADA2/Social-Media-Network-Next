import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { PostComments } from './post-comments';
import { useQuery } from '@tanstack/react-query';
import { useCommentAuthors } from '@/features/get-comments/use-comment-authors';
import { type CommentInterface, type PublicUser } from '../comment/types';

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock('@/features/get-comments/use-comment-authors', () => ({
  useCommentAuthors: vi.fn(),
}));

vi.mock('@/entities/comment', () => ({
  Comment: ({ id, text, author }: CommentInterface) => (
    <div data-testid={`comment-${id}`}>
      {text} — {author?.username ?? 'unknown'}
    </div>
  ),
}));

vi.mock('@/shared/ui/loader', () => ({
  Loader: ({ isBlock }: { isBlock?: boolean }) => (
    <div data-testid="loader" data-block={isBlock}>
      Loading...
    </div>
  ),
}));

vi.mock('@/features/create-comment', () => ({
  CreateComment: ({ postId }: { postId: number }) => (
    <div data-testid="create-comment" data-post-id={postId}>
      Create comment
    </div>
  ),
}));

describe('PostComments', () => {
  const postId = 1;

  beforeEach(() => {
    vi.mocked(useCommentAuthors).mockReturnValue(new Map());
  });

  test('shows loader when pending', async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isPending: true,
      isError: false,
    } as unknown as ReturnType<typeof useQuery>);

    const screen = await render(<PostComments postId={postId} />);

    await expect.element(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByTestId('create-comment')).not.toBeInTheDocument();
  });

  test('shows error message when isError', async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isPending: false,
      isError: true,
    } as ReturnType<typeof useQuery>);

    const screen = await render(<PostComments postId={postId} />);

    await expect
      .element(screen.getByText('Cannot get comments'))
      .toBeInTheDocument();
    await expect
      .element(screen.getByTestId('create-comment'))
      .toBeInTheDocument();
  });

  test('renders empty list when no comments', async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isPending: false,
      isError: false,
    } as ReturnType<typeof useQuery>);

    const screen = await render(<PostComments postId={postId} />);

    expect(screen.getByText('Cannot get comments')).not.toBeInTheDocument();
    await expect
      .element(screen.getByTestId('create-comment'))
      .toBeInTheDocument();
  });

  test('renders comments with authors', async () => {
    const comments = [
      {
        id: 1,
        text: 'First',
        authorId: 10,
        postId,
        creationDate: '',
        modifiedDate: '',
        author: null,
      },
      {
        id: 2,
        text: 'Second',
        authorId: 20,
        postId,
        creationDate: '',
        modifiedDate: '',
        author: null,
      },
    ];

    vi.mocked(useQuery).mockReturnValue({
      data: comments,
      isPending: false,
      isError: false,
    } as ReturnType<typeof useQuery>);

    vi.mocked(useCommentAuthors).mockReturnValue(
      new Map([
        [10, { id: 10, username: 'alice' } as PublicUser],
        [20, { id: 20, username: 'bob' } as PublicUser],
      ]),
    );

    const screen = await render(<PostComments postId={postId} />);

    await expect
      .element(screen.getByTestId('comment-1'))
      .toHaveTextContent('First — alice');
    await expect
      .element(screen.getByTestId('comment-2'))
      .toHaveTextContent('Second — bob');
    await expect
      .element(screen.getByTestId('create-comment'))
      .toBeInTheDocument();
  });

  test('passes postId to CreateComment', async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isPending: false,
      isError: false,
    } as ReturnType<typeof useQuery>);

    const screen = await render(<PostComments postId={42} />);

    await expect
      .element(screen.getByTestId('create-comment'))
      .toHaveAttribute('data-post-id', '42');
  });
});
