import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { MainSidebar } from '.';
import { useQuery } from '@tanstack/react-query';
import { communityReact, userAlice, userBob } from '@/test/mockUsers';

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock('@/entities/sidebar', () => ({
  Sidebar: ({ title, users }: { title: string; users: unknown[] }) => (
    <div data-testid="sidebar" data-title={title} data-count={users.length}>
      {title}
    </div>
  ),
}));

describe('MainSidebar', () => {
  beforeEach(() => {
    vi.mocked(useQuery).mockReset();
  });

  test('renders suggested people and communities', async () => {
    vi.mocked(useQuery)
      .mockReturnValueOnce({
        data: [userAlice, userBob],
        isPending: false,
        isError: false,
      } as unknown as ReturnType<typeof useQuery>)
      .mockReturnValueOnce({
        data: [communityReact],
        isPending: false,
        isError: false,
      } as unknown as ReturnType<typeof useQuery>);

    const screen = await render(<MainSidebar />);

    const sidebars = screen.getByTestId('sidebar').elements();

    expect(sidebars).toHaveLength(2);
    await expect
      .element(screen.getByText('sidebar.suggestedPeople'))
      .toBeVisible();
    await expect.element(screen.getByText('sidebar.communities')).toBeVisible();
  });

  test('shows error sidebar for people when isError', async () => {
    vi.mocked(useQuery)
      .mockReturnValueOnce({
        data: undefined,
        isPending: false,
        isError: true,
      } as unknown as ReturnType<typeof useQuery>)
      .mockReturnValueOnce({
        data: [communityReact],
        isPending: false,
        isError: false,
      } as unknown as ReturnType<typeof useQuery>);

    const screen = await render(<MainSidebar />);

    await expect.element(screen.getByText('cannot get people')).toBeVisible();
    await expect.element(screen.getByText('sidebar.communities')).toBeVisible();
  });

  test('shows error sidebar for communities when isError', async () => {
    vi.mocked(useQuery)
      .mockReturnValueOnce({
        data: [userAlice],
        isPending: false,
        isError: false,
      } as unknown as ReturnType<typeof useQuery>)
      .mockReturnValueOnce({
        data: undefined,
        isPending: false,
        isError: true,
      } as unknown as ReturnType<typeof useQuery>);

    const screen = await render(<MainSidebar />);

    await expect
      .element(screen.getByText('sidebar.suggestedPeople'))
      .toBeVisible();
    await expect
      .element(screen.getByText('cannot get communities'))
      .toBeVisible();
  });

  test('renders nothing when pending', async () => {
    vi.mocked(useQuery)
      .mockReturnValueOnce({
        data: undefined,
        isPending: true,
        isError: false,
      } as unknown as ReturnType<typeof useQuery>)
      .mockReturnValueOnce({
        data: undefined,
        isPending: true,
        isError: false,
      } as unknown as ReturnType<typeof useQuery>);

    const screen = await render(<MainSidebar />);

    await expect(screen.getByTestId('sidebar')).not.toBeInTheDocument();
  });
});
