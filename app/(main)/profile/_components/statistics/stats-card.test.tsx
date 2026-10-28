import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { StatsCard } from './stats-card';

describe('StatsCard', () => {
  test('Shows title, value and positive percents', async () => {
    const screen = await render(
      <StatsCard title="title" value={5} percents={10} />,
    );

    await expect.element(screen.getByText('title')).toBeVisible();
    await expect.element(screen.getByText('5')).toBeVisible();
    await expect
      .element(screen.getByText('+10% stats.weekOverWeek'))
      .toBeVisible();
  });

  test('Shows negative percents', async () => {
    const screen = await render(
      <StatsCard title="title" value={0} percents={-100} />,
    );

    await expect
      .element(screen.getByText('-100% stats.weekOverWeek'))
      .toBeVisible();
  });

  test('Shows zero percents', async () => {
    const screen = await render(
      <StatsCard title="title" value={0} percents={0} />,
    );

    await expect.element(screen.getByText('0')).toBeVisible();
    await expect
      .element(screen.getByText('+0% stats.weekOverWeek'))
      .toBeVisible();
  });
});
