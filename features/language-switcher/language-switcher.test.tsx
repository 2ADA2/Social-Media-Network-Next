import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '.';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
}));

describe('LanguageSwitcher', () => {
  const mockChangeLanguage = vi.fn();

  beforeEach(() => {
    mockChangeLanguage.mockClear();

    vi.mocked(useTranslation).mockReturnValue({
      i18n: {
        language: 'en',
        changeLanguage: mockChangeLanguage,
      },
      t: (key: string) => key,
    } as unknown as ReturnType<typeof useTranslation>);
  });

  test('renders options and selects current language', async () => {
    const screen = await render(<LanguageSwitcher />);
    const select = screen.getByRole('combobox', { name: 'Language' });

    await expect.element(select).toHaveValue('en');
    await expect
      .element(screen.getByRole('option', { name: 'English' }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole('option', { name: 'Русский' }))
      .toBeInTheDocument();
  });

  test('normalizes language with region code', async () => {
    vi.mocked(useTranslation).mockReturnValue({
      i18n: { language: 'en-US', changeLanguage: mockChangeLanguage },
      t: (key: string) => key,
    } as unknown as ReturnType<typeof useTranslation>);

    const screen = await render(<LanguageSwitcher />);
    await expect
      .element(screen.getByRole('combobox', { name: 'Language' }))
      .toHaveValue('en');
  });

  test('changes language on selection', async () => {
    const user = userEvent.setup();
    const screen = await render(<LanguageSwitcher />);

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Language' }),
      'ru',
    );

    expect(mockChangeLanguage).toHaveBeenCalledWith('ru');
  });
});
