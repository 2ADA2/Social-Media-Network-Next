import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TableView } from '.';

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

describe('TableView', () => {
  test('Renders both tables with correct data ( 0 replaces with "-" )', async () => {
    const screen = await render(
      <TableView likesByDay={likesByDay} commentsByDay={commentsByDay} />,
    );

    await expect.element(screen.getByText('stats.likes')).toBeVisible();
    await expect.element(screen.getByText('stats.likes')).toBeVisible();

    await expect.element(screen.getByText('2024-01-01').first()).toBeVisible();
    await expect.element(screen.getByText('2024-01-02').first()).toBeVisible();
    await expect.element(screen.getByText('2024-01-03').first()).toBeVisible();
    await expect.element(screen.getByText('5').first()).toBeVisible();
    await expect.element(screen.getByText('3').first()).toBeVisible();
    await expect.element(screen.getByText('7').first()).toBeVisible();
    await expect.element(screen.getByText('2').first()).toBeVisible();
  });

  test('"0" replaces with "-"', async () => {
    const screen = await render(
      <TableView
        likesByDay={[{ date: '2024-01-01', count: 0 }]}
        commentsByDay={[{ date: '2024-01-01', count: 0 }]}
      />,
    );

    await expect.element(screen.getByText('-').first()).toBeVisible();
  });
});
