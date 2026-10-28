import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { EditProfile } from '.';
import { useUser } from '@/entities/user/model/use-user';
import { useUpdateProfile } from '@/features/edit-profile/use-update-profile';
import { useNotifications } from '@/app/providers/notifications-context/useNotifications';
import { useModal } from '@/shared/lib/hooks/use-modal';

let user = userEvent.setup();
const mockMutate = vi.fn();
const mockAdd = vi.fn();

vi.mock('@/entities/user/model/use-user', () => ({
  useUser: vi.fn(),
}));

vi.mock('@/features/edit-profile/use-update-profile', () => ({
  useUpdateProfile: vi.fn(),
}));

vi.mock('@/app/providers/notifications-context/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

vi.mock('@/shared/lib/hooks/use-modal', () => ({
  useModal: vi.fn(),
}));

vi.mock(
  '@/pages/profile/profile-info/edit-profile/modals/update-profile-image-modal',
  () => ({
    UpdateProfileImageModal: () => (
      <div data-testid="image-modal">image-modal</div>
    ),
  }),
);

vi.mock(
  '@/pages/profile/profile-info/edit-profile/modals/confirm-password-modal',
  () => ({
    ConfirmPasswordModal: ({ isOpen }: { isOpen: boolean }) =>
      isOpen ? <div>modal</div> : null,
  }),
);

describe('EditProfile', () => {
  beforeEach(() => {
    user = userEvent.setup();
    mockMutate.mockReset();
    mockAdd.mockReset();
    vi.mocked(useModal).mockReset();

    vi.mocked(useModal).mockReturnValue({
      isOpen: false,
      open: vi.fn(),
      close: vi.fn(),
    });

    vi.mocked(useUser).mockReturnValue({
      user: {
        name: 'Helena',
        surname: 'Hills',
        username: 'helenahills',
        email: 'helena.hills@social.com',
        description: 'Travel and design enthusiast.',
        avatar: '/assets/helena.png',
      },
    } as unknown as ReturnType<typeof useUser>);

    vi.mocked(useUpdateProfile).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateProfile>);

    vi.mocked(useNotifications).mockReturnValue({
      add: mockAdd,
      notifications: [],
    } as unknown as ReturnType<typeof useNotifications>);
  });

  test('Shows validation error if invalid', async () => {
    const screen = await render(<EditProfile />);

    const firstNameField = screen.getByPlaceholder(
      'editProfile.firstNamePlaceholder',
    );
    const emailField = screen.getByPlaceholder('editProfile.emailPlaceholder');

    await user.clear(firstNameField);
    await user.type(firstNameField, 'a very long name, invalid name');
    await user.keyboard('{Tab}');

    await user.clear(emailField);
    await user.type(emailField, 'invalid@mail');
    await user.keyboard('{Tab}');

    await user.click(
      screen.getByRole('button', { name: 'editProfile.submit' }),
    );

    await expect(firstNameField).toHaveAttribute('aria-invalid', 'true');
    await expect(emailField).toHaveAttribute('aria-invalid', 'true');

    expect(mockMutate).not.toHaveBeenCalled();
    expect(mockAdd).not.toHaveBeenCalled();
  });

  test('Updates profile if valid', async () => {
    mockMutate.mockImplementation((_, opts) => opts.onSuccess());

    const screen = await render(<EditProfile />);

    const firstNameField = screen.getByPlaceholder(
      'editProfile.firstNamePlaceholder',
    );
    const descriptionField = screen.getByPlaceholder(
      'editProfile.descriptionPlaceholder',
    );

    await user.clear(firstNameField);
    await user.type(firstNameField, 'John');
    await user.keyboard('{Tab}');

    await user.clear(descriptionField);
    await user.type(descriptionField, 'New bio');
    await user.keyboard('{Tab}');

    await user.click(
      screen.getByRole('button', { name: 'editProfile.submit' }),
    );

    await expect(firstNameField).toHaveAttribute('aria-invalid', 'false');

    expect(mockMutate).toHaveBeenCalledWith(
      {
        firstName: 'John',
        secondName: 'Hills',
        username: 'helenahills',
        description: 'New bio',
      },
      expect.objectContaining({
        onError: expect.any(Function),
        onSuccess: expect.any(Function),
      }),
    );
    expect(mockAdd).toHaveBeenCalledWith({
      message: 'editProfile.success',
    });
  });
});
