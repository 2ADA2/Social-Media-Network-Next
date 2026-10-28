import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { Statistics } from '.';
import { useQuery } from '@tanstack/react-query';

let user = userEvent.setup();

const mockCountByWeek = vi.fn();
const mockCountByDay = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('@/features/get-statistics/stats', () => ({
  statsQueries: {
    posts: () => ({ queryKey: ['posts-stats'] }),
    comments: () => ({ queryKey: ['comments-stats'] }),
    likes: () => ({ queryKey: ['likes-stats'] }),
  },
}));

vi.mock('@/shared/lib/stats/date-stats', () => ({
  countByWeek: (...args: unknown[]) => mockCountByWeek(...args),
}));

vi.mock('@/shared/lib/stats/count-by-day', () => ({
  countByDay: (...args: unknown[]) => mockCountByDay(...args),
}));

vi.mock('@/pages/profile/statistics/stats-card', () => ({
  StatsCard: ({ title, value }: { title: string; value: number }) => (
    <div data-testid="stats-card">
      {title}: {value}
    </div>
  ),
}));

vi.mock('@/pages/profile/statistics/table-view', () => ({
  TableView: () => <div data-testid="table-view">Table View</div>,
}));

vi.mock('./chart-view', () => ({
  default: () => <div data-testid="chart-view">Chart View</div>,
}));

vi.mock('@/shared/ui/loader', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}));

describe('Statistics', () => {
  beforeEach(() => {
    user = userEvent.setup();
    mockCountByWeek.mockReset();
    mockCountByDay.mockReset();

    mockCountByWeek.mockReturnValue({ current: 5, percents: 10 });
    mockCountByDay.mockReturnValue([]);

    vi.mocked(useQuery).mockImplementation((options) => {
      const key = (options as { queryKey: string[] }).queryKey?.[0];
      if (key === 'posts-stats')
        return { data: [{ creationDate: '2024-01-01' }] } as never;
      if (key === 'comments-stats')
        return { data: [{ creationDate: '2024-01-02' }] } as never;
      if (key === 'likes-stats')
        return { data: [{ creationDate: '2024-01-03' }] } as never;
      return { data: undefined } as never;
    });
  });

  test('Renders stats cards', async () => {
    const screen = await render(<Statistics />);

    await expect.element(screen.getByText('stats.likes: 5')).toBeVisible();
    await expect.element(screen.getByText('stats.comments: 5')).toBeVisible();
    await expect.element(screen.getByText('stats.posts: 5')).toBeVisible();
  });

  test('Click on toggle switches view', async () => {
    const screen = await render(<Statistics />);

    await expect.element(screen.getByTestId('table-view')).toBeVisible();
    await expect
      .element(screen.getByTestId('chart-view'))
      .not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'stats.switchView' }));

    await expect
      .element(screen.getByTestId('table-view'))
      .not.toBeInTheDocument();
    await expect.element(screen.getByTestId('chart-view')).toBeVisible();
  });
});
