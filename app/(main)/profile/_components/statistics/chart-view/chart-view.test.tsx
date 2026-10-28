import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import ChartView from '.';

const mockBuildOptions = vi.fn();

vi.mock('@/pages/profile/statistics/chart-view/options', () => ({
  buildOptions: (...args: unknown[]) => mockBuildOptions(...args),
}));

vi.mock('i18next', () => ({
  default: { language: 'en' },
}));

const likesByDay = [
  { date: '2024-01-01', count: 5 },
  { date: '2024-01-02', count: 0 },
  { date: '2024-01-03', count: 3 },
];

const commentsByDay = [
  { date: '2024-01-01', count: 2 },
  { date: '2024-01-02', count: 0 },
  { date: '2024-01-03', count: 7 },
];

describe('ChartView', () => {
  beforeEach(() => {
    mockBuildOptions.mockReset();
    mockBuildOptions.mockImplementation((categories, theme, id, type) => ({
      categories,
      theme,
      id,
      type,
    }));
  });

  test('Resnders both charts with data', async () => {
    const screen = await render(
      <ChartView
        likesByDay={likesByDay}
        commentsByDay={commentsByDay}
        theme="light"
      />,
    );

    await expect
      .element(screen.getByRole('heading', { name: 'stats.likes' }))
      .toBeVisible();
    await expect
      .element(screen.getByRole('heading', { name: 'stats.comments' }))
      .toBeVisible();

    const charts = screen.container.querySelectorAll('.apexcharts-canvas');
    expect(charts).toHaveLength(2);
  });

  test('Calls build options with correct data', async () => {
    await render(
      <ChartView
        likesByDay={likesByDay}
        commentsByDay={commentsByDay}
        theme="dark"
      />,
    );

    expect(mockBuildOptions).toHaveBeenCalledWith(
      ['2024-01-01', '2024-01-02', '2024-01-03'],
      'dark',
      'likes-chart',
      'line',
      'en',
    );
    expect(mockBuildOptions).toHaveBeenCalledWith(
      ['2024-01-01', '2024-01-02', '2024-01-03'],
      'dark',
      'comments-chart',
      'bar',
      'en',
    );
  });
});
