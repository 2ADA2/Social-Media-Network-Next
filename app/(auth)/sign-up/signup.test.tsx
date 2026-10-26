import { describe, expect, test, vi, beforeEach } from 'vitest';
import { userEvent } from 'vitest/browser';
import SignUp from '.';
import { useAuth } from '@/features/auth/use-auth';
import { useNotifications } from '@/app/providers/notifications-context/useNotifications';
import { renderWithRouter } from '@/test/render-with-router';

let user = userEvent.setup();
const mockAdd = vi.fn();
const mockSignup = vi.fn();

vi.mock('@/features/auth/use-auth', async () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/app/providers/notifications-context/useNotifications', async () => ({
  useNotifications: vi.fn(),
}));

describe('SignUp', () => {
  beforeEach(() => {
    user = userEvent.setup();
    mockSignup.mockReset();
    mockAdd.mockReset();

    vi.mocked(useAuth).mockReturnValue({
      signin: vi.fn(),
      signup: mockSignup,
      logout: vi.fn(),
      auth: vi.fn(),
      isAuth: false,
    } as unknown as ReturnType<typeof useAuth>);

    vi.mocked(useNotifications).mockReturnValue({
      add: mockAdd,
      notifications: [],
    } as unknown as ReturnType<typeof useNotifications>);
  });

  test('Shows validation error for empty fields', async () => {
    const screen = await renderWithRouter(<SignUp />);

    const firstNameField = screen.getByPlaceholder(
      'signUp.firstNamePlaceholder',
    );
    const secondNameField = screen.getByPlaceholder(
      'signUp.secondNamePlaceholder',
    );
    const emailField = screen.getByPlaceholder('signUp.emailPlaceholder');
    const passwordField = screen.getByPlaceholder('signUp.passwordPlaceholder');
    const submitButton = screen.getByTestId('submit-button');

    await user.click(submitButton);

    await expect(firstNameField).toHaveAttribute('aria-invalid', 'true');
    await expect(secondNameField).toHaveAttribute('aria-invalid', 'true');
    await expect(emailField).toHaveAttribute('aria-invalid', 'true');
    await expect(passwordField).toHaveAttribute('aria-invalid', 'true');

    expect(mockSignup).not.toHaveBeenCalledWith();
    expect(mockAdd).not.toHaveBeenCalled();
  });

  test('Shows validation error for invalid fields', async () => {
    const screen = await renderWithRouter(<SignUp />);

    const firstNameField = screen.getByPlaceholder(
      'signUp.firstNamePlaceholder',
    );
    const secondNameField = screen.getByPlaceholder(
      'signUp.secondNamePlaceholder',
    );
    const emailField = screen.getByPlaceholder('signUp.emailPlaceholder');
    const passwordField = screen.getByPlaceholder('signUp.passwordPlaceholder');
    const submitButton = screen.getByTestId('submit-button');

    await user.type(firstNameField, 'Normal Name');
    await user.type(secondNameField, 'Very Very long and invalid second name');
    await user.type(emailField, 'invalid@mail');
    await user.type(passwordField, 'passwordpassword');

    await user.click(submitButton);

    await expect(firstNameField).not.toHaveAttribute('aria-invalid', 'true');
    await expect(screen.getByText('validation.secondNameMax')).toBeVisible();
    await expect(screen.getByText('validation.emailInvalid')).toBeVisible();
    await expect(screen.getByText('validation.passwordDigit')).toBeVisible();

    expect(mockSignup).not.toHaveBeenCalled();
    expect(mockAdd).not.toHaveBeenCalled();
  });

  test('Sign up if fields are valid', async () => {
    const screen = await renderWithRouter(<SignUp />);

    const firstNameField = screen.getByPlaceholder(
      'signUp.firstNamePlaceholder',
    );
    const secondNameField = screen.getByPlaceholder(
      'signUp.secondNamePlaceholder',
    );
    const emailField = screen.getByPlaceholder('signUp.emailPlaceholder');
    const passwordField = screen.getByPlaceholder('signUp.passwordPlaceholder');
    const submitButton = screen.getByTestId('submit-button');

    await user.type(firstNameField, 'Helena');
    await user.keyboard('{Tab}');
    await user.type(secondNameField, 'Hills');
    await user.keyboard('{Tab}');
    await user.type(emailField, 'helena.hills@social.com');
    await user.keyboard('{Tab}');
    await user.type(passwordField, 'password123');
    await user.keyboard('{Tab}');

    await user.click(submitButton);

    await expect(firstNameField).toHaveAttribute('aria-invalid', 'false');
    await expect(secondNameField).toHaveAttribute('aria-invalid', 'false');
    await expect(emailField).toHaveAttribute('aria-invalid', 'false');
    await expect(passwordField).toHaveAttribute('aria-invalid', 'false');

    expect(mockSignup).toHaveBeenCalledWith({
      firstName: 'Helena',
      secondName: 'Hills',
      email: 'helena.hills@social.com',
      password: 'password123',
    });
    expect(mockAdd).toHaveBeenCalledWith({ message: 'signUp.success' });
  });
});
