import { beforeEach, describe, expect, test, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostsList } from './posts-list';
import { usePosts } from './usePosts';
import { postsQueries } from './posts-query';
import { renderWithRouter } from '@/test/render-with-router';

vi.mock('./usePosts', () => ({
  usePosts: vi.fn(),
}));

vi.mock('@/features/create-post', () => ({
  CreatePost: ({ onAdd }: { onAdd: () => void }) => (
    <button type="button" data-testid="mock-create-post" onClick={onAdd}>
      Create Post
    </button>
  ),
}));

vi.mock('@/entities/post', () => ({
  Post: ({ post }: { post: { id: number } }) => (
    <div data-testid={`post-${post.id}`}>Post {post.id}</div>
  ),
}));

vi.mock('@/shared/ui/loader', () => ({
  Loader: ({ isBlock }: { isBlock?: boolean }) => (
    <div data-testid={isBlock !== false ? 'loader-block' : 'loader-inline'} />
  ),
}));

const mockUseIntersectionObserver = vi.fn();
vi.mock('@/shared/lib/hooks/use-intersection-observer', () => ({
  useIntersectionObserver: (options: { onIntersect: () => void }) => {
    mockUseIntersectionObserver(options);
    return vi.fn();
  },
}));

describe('PostsList', () => {
  let queryClient: QueryClient;
  const mockFetchNextPage = vi.fn();

  const mockUsePosts = (overrides = {}) => {
    vi.mocked(usePosts).mockReturnValue({
      data: { pages: [] },
      isPending: false,
      isError: false,
      error: null,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
      ...overrides,
    } as unknown as ReturnType<typeof usePosts>);
  };

  const renderWithClient = async () =>
    renderWithRouter(
      <QueryClientProvider client={queryClient}>
          <PostsList />
      </QueryClientProvider>,
    );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    mockFetchNextPage.mockReset();
    mockUsePosts();
  });

  test('renders block loader while pending and no posts', async () => {
    mockUsePosts({ isPending: true, data: undefined });
    const screen = await renderWithClient();
    await expect
      .element(screen.getByTestId('loader-block'))
      .toBeInTheDocument();
  });

  test('throws error if isError is true', async () => {
    mockUsePosts({ isError: true, error: new Error('Network error') });
    const screen = await renderWithClient();
    await expect.element(screen.getByText('Network error')).toBeInTheDocument();
  });

  test('renders posts', async () => {
    mockUsePosts({
      data: { pages: [{ items: [{ id: 1 }, { id: 2 }] }] },
    });
    const screen = await renderWithClient();

    await expect.element(screen.getByTestId('post-1')).toBeInTheDocument();
    await expect.element(screen.getByTestId('post-2')).toBeInTheDocument();
  });

  test('renders inline loader when fetching next page', async () => {
    mockUsePosts({
      data: { pages: [{ items: [{ id: 1 }] }] },
      isFetchingNextPage: true,
      hasNextPage: true,
    });
    const screen = await renderWithClient();

    await expect
      .element(screen.getByTestId('loader-inline'))
      .toBeInTheDocument();
  });

  test('does not render intersection anchor if no next page', async () => {
    mockUsePosts({ data: { pages: [{ items: [{ id: 1 }] }] } });
    await renderWithClient();
    const options = mockUseIntersectionObserver.mock.calls[0][0];

    expect(options.onIntersect).toBeTypeOf('function');
    options.onIntersect();
    expect(mockFetchNextPage).not.toHaveBeenCalled();
  });

  test('calls fetchNextPage when intersected and has next page', async () => {
    mockUsePosts({
      data: { pages: [{ items: [{ id: 1 }] }] },
      hasNextPage: true,
    });
    await renderWithClient();
    const options = mockUseIntersectionObserver.mock.calls[0][0];

    options.onIntersect();
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  test('invalidates queries when a post is created', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    mockUsePosts({ data: { pages: [{ items: [] }] } });
    const screen = await renderWithClient();

    const user = (await import('vitest/browser')).userEvent.setup();
    await user.click(screen.getByTestId('mock-create-post'));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: postsQueries.infinite().queryKey,
    });
  });
});
