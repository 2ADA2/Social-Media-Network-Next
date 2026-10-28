import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { LanguageSwitcher } from '.';

vi.mock('next-intl', () => ({
  useLocale: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('LanguageSwitcher', () => {
  const mockRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLocale).mockReturnValue('en');
    vi.mocked(useRouter).mockReturnValue({
      refresh: mockRefresh,
    } as unknown as ReturnType<typeof useRouter>);
  });

  test('renders options and selects current language', async () => {
    const screen = await render(<LanguageSwitcher />);
    const select = screen.getByRole('combobox', { name: 'Language' });

    await expect.element(select).toHaveValue('en');
    await expect.element(screen.getByRole('option', { name: 'English' })).toBeInTheDocument();
    await expect.element(screen.getByRole('option', { name: 'Русский' })).toBeInTheDocument();
  });

  test('changes language on selection', async () => {
    const user = userEvent.setup();
    const screen = await render(<LanguageSwitcher />);

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Language' }),
      'ru',
    );

    expect(document.cookie).toContain('NEXT_LOCALE=ru');
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});