import { beforeEach, describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { ThemeSwitcher } from '.';
import { useThemeStore } from '@/app/store/theme-store';

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'light' });
  });

  test('renders unpressed when theme is light', async () => {
    const screen = await render(<ThemeSwitcher />);

    const toggle = screen.getByRole('button');

    await expect.element(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  test('renders pressed when theme is dark', async () => {
    useThemeStore.setState({ theme: 'dark' });

    const screen = await render(<ThemeSwitcher />);

    const toggle = screen.getByRole('button');

    await expect.element(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  test('toggles theme on click', async () => {
    const user = userEvent.setup();
    const screen = await render(<ThemeSwitcher />);

    const toggle = screen.getByRole('button');

    await user.click(toggle);

    expect(useThemeStore.getState().theme).toBe('dark');
    await expect.element(toggle).toHaveAttribute('aria-pressed', 'true');

    await user.click(toggle);

    expect(useThemeStore.getState().theme).toBe('light');
    await expect.element(toggle).toHaveAttribute('aria-pressed', 'false');
  });
});
