import { describe, expect, test, vi, beforeEach } from 'vitest';
import { userEvent } from 'vitest/browser';
import SignIn from '.';
import { useAuth } from '@/features/auth/use-auth';
import { useNotifications } from '@/app/providers/notifications-context/useNotifications';
import { renderWithRouter } from '@/test/render-with-router';

let user = userEvent.setup();

const mockSignin = vi.fn();
const mockAdd = vi.fn();

vi.mock('@/features/auth/use-auth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/app/providers/notifications-context/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

describe('SignIn', () => {
  beforeEach(() => {
    user = userEvent.setup();
    mockSignin.mockReset();
    mockAdd.mockReset();

    vi.mocked(useAuth).mockReturnValue({
      signin: mockSignin,
      signup: vi.fn(),
      logout: vi.fn(),
      auth: vi.fn(),
      isAuth: false,
    } as unknown as ReturnType<typeof useAuth>);

    vi.mocked(useNotifications).mockReturnValue({
      add: mockAdd,
      notifications: [],
    } as unknown as ReturnType<typeof useNotifications>);
  });

  test('submits form and calls signin with credentials on success', async () => {
    mockSignin.mockResolvedValueOnce(undefined);

    const screen = await renderWithRouter(<SignIn />);

    await user.type(
      screen.getByRole('textbox', { name: 'signIn.email' }),
      'helena@social.com',
    );
    await user.type(
      screen.getByRole('textbox', { name: 'signIn.password' }),
      'password',
    );

    await user.click(screen.getByRole('button', { name: 'signIn.submit' }));

    expect(mockSignin).toHaveBeenCalledWith('helena@social.com', 'password');
    expect(mockAdd).toHaveBeenCalledWith({ message: 'signIn.success' });
  });

  test('does not submit and shows errors when fields are empty', async () => {
    const screen = await renderWithRouter(<SignIn />);

    await user.click(screen.getByRole('button', { name: 'signIn.submit' }));

    expect(mockSignin).not.toHaveBeenCalled();

    await expect
      .element(screen.getByRole('textbox', { name: /signIn\.email/ }))
      .toHaveAttribute('aria-invalid', 'true');

    await expect
      .element(screen.getByRole('textbox', { name: /signIn\.password/ }))
      .toHaveAttribute('aria-invalid', 'true');
  });

  test('does not submit and shows errors when fields are invalid', async () => {
    const screen = await renderWithRouter(<SignIn />);

    await user.type(
      screen.getByRole('textbox', { name: 'signIn.email' }),
      'not-an-email',
    );
    await user.type(
      screen.getByRole('textbox', { name: 'signIn.password' }),
      '123',
    );

    await user.click(screen.getByRole('button', { name: 'signIn.submit' }));

    expect(mockSignin).not.toHaveBeenCalled();

    await expect
      .element(screen.getByRole('textbox', { name: /signIn\.email/ }))
      .toHaveAttribute('aria-invalid', 'true');

    await expect
      .element(screen.getByRole('textbox', { name: /signIn\.password/ }))
      .toHaveAttribute('aria-invalid', 'true');
  });
});
