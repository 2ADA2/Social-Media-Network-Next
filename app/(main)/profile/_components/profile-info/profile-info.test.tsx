import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { ProfileInfo } from '.';
import { useAuth } from '@/features/auth/use-auth';

let user = userEvent.setup();

const mockLogout = vi.fn();

vi.mock('@/features/auth/use-auth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/features/theme-switcher', () => ({
  ThemeSwitcher: () => <div data-testid="theme-switcher">theme switcer</div>,
}));

vi.mock('@/features/language-switcher', () => ({
  LanguageSwitcher: () => (
    <div data-testid="language-switcher">language switcer</div>
  ),
}));

vi.mock('./edit-profile', () => ({
  EditProfile: () => <div data-testid="edit-profile">edit profile</div>,
}));

describe('ProfileInfo', () => {
  beforeEach(() => {
    user = userEvent.setup();
    mockLogout.mockReset();

    vi.mocked(useAuth).mockReturnValue({
      logout: mockLogout,
      signin: vi.fn(),
      signup: vi.fn(),
      auth: vi.fn(),
      isAuth: true,
    } as unknown as ReturnType<typeof useAuth>);
  });

  test('Renders all sections with swtichers', async () => {
    const screen = await render(<ProfileInfo />);

    await expect.element(screen.getByTestId('edit-profile')).toBeVisible();
    await expect.element(screen.getByTestId('theme-switcher')).toBeVisible();
    await expect.element(screen.getByTestId('language-switcher')).toBeVisible();
  });

  test('Calls logout on button click', async () => {
    const screen = await render(<ProfileInfo />);

    await user.click(screen.getByRole('button', { name: 'actions.logout' }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
