import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { type Tab, Tabs } from '.';
import { userEvent } from 'vitest/browser';

describe('Tabs component', () => {
  const tabs: Tab[] = [
    { id: 'tab-1', label: 'tab-1' },
    { id: 'tab-2', label: 'tab-2' },
    { id: 'tab-3', label: 'tab-3' },
  ];

  test('renders a tablist with all tabs', async () => {
    const screen = await render(
      <Tabs tabs={tabs} activeTab={tabs[0].id} onChange={vi.fn()} />,
    );

    await expect.element(screen.getByRole('tablist')).toBeInTheDocument();

    for (const tab of tabs) {
      await expect
        .element(screen.getByRole('tab', { name: tab.label }))
        .toBeVisible();
    }
  });

  test('marks selected tab as selected=true', async () => {
    const screen = await render(
      <Tabs tabs={tabs} activeTab={tabs[1].id} onChange={vi.fn()} />,
    );

    await expect.element(screen.getByRole('tablist')).toBeInTheDocument();

    await expect
      .element(screen.getByRole('tab', { name: tabs[1].label }))
      .toHaveAttribute('aria-selected', 'true');
    await expect
      .element(screen.getByRole('tab', { name: tabs[0].label }))
      .toHaveAttribute('aria-selected', 'false');
    await expect
      .element(screen.getByRole('tab', { name: tabs[2].label }))
      .toHaveAttribute('aria-selected', 'false');
  });

  test('onChange provides clicked tab id', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const screen = await render(
      <Tabs tabs={tabs} activeTab={tabs[0].id} onChange={onChange} />,
    );

    await user.click(screen.getByRole('tab', { name: tabs[0].label }));
    expect(onChange).toHaveBeenLastCalledWith(tabs[0].id);
    expect(onChange).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('tab', { name: tabs[2].label }));
    expect(onChange).toHaveBeenLastCalledWith(tabs[2].id);
    expect(onChange).toHaveBeenCalledTimes(2);

    await user.click(screen.getByRole('tab', { name: tabs[1].label }));
    expect(onChange).toHaveBeenLastCalledWith(tabs[1].id);
    expect(onChange).toHaveBeenCalledTimes(3);
  });
});
