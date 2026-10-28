import { CoverButton } from '@/shared/ui/cover-button';
import { Input } from '@/shared/ui/input';
import { useUser } from '@/entities/user/model/use-user';
import MailIcon from '@/shared/assets/icons/mail.svg';
import UserIcon from '@/shared/assets/icons/user.svg';
import Pen from '@/shared/assets/icons/pen.svg';
import { TextArea } from '@/shared/ui/text-area';
import { Button } from '@/shared/ui/button';
import { useLocale, useTranslations } from "next-intl";
import './edit-profile.css';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  editProfileSchema,
  type EditProfileSchema,
} from './edit-profile-schema';
import { useUpdateProfile } from '@/features/edit-profile/use-update-profile';
import { useModal } from '@/shared/lib/hooks/use-modal';
import { useNotifications } from '@/app/providers/notifications-provider/useNotifications';
import { Avatar } from '@/shared/ui/avatar';
import { useEffect, useMemo, useState } from 'react';
import { UpdateProfileImageModal } from './modals/update-profile-image-modal';
import { ConfirmPasswordModal } from './modals/confirm-password-modal';
import { Loader } from '@/shared/ui/loader';

export const EditProfile = () => {
  const t = useTranslations('profile');
  const locale = useLocale()
  const { user } = useUser();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const {
    isOpen: isUpdateImageOpen,
    open: openUpdateImage,
    close: closeUpdateImage,
  } = useModal();
  const {
    isOpen: isConfirmOpen,
    open: openConfirm,
    close: closeConfirm,
  } = useModal();
  const { add } = useNotifications();
  const [isMounted, setIsMounted] = useState(false)

  const schema = useMemo(() => editProfileSchema(t), [locale]);

  const defaultValues = useMemo(
    () => ({
      firstName: user?.name ?? '',
      secondName: user?.surname ?? '',
      username: '@' + (user?.username ?? ''),
      email: user?.email ?? '',
      description: user?.description ?? '',
    }),
    [user],
  );

  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
    reset,
    watch,
    trigger,
  } = useForm<EditProfileSchema>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onTouched',
  });

  useEffect(() => {
    setIsMounted(true)
    trigger();
  }, [locale, trigger]);

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.name ?? '',
        secondName: user.surname ?? '',
        username: '@' + (user.username ?? ''),
        email: user.email ?? '',
        description: user.description ?? '',
      });
    }
  }, [user, reset]);

  const emailValue = watch('email');

  const saveChanges = (data: EditProfileSchema) => {
    data.username = data.username.slice(1);
    reset({
      email: emailValue,
    });

    const hasProfileChanges =
      dirtyFields.firstName ||
      dirtyFields.secondName ||
      dirtyFields.username ||
      dirtyFields.description;
    const hasEmailChanges = dirtyFields.email;

    if (!hasProfileChanges && !hasEmailChanges) {
      add({ message: t('editProfile.noChanges') });
      return;
    }

    if (!hasProfileChanges) {
      return;
    }

    updateProfile(
      {
        firstName: data.firstName,
        secondName: data.secondName,
        username: data.username,
        description: data.description,
      },
      {
        onSuccess: () => {
          add({ message: t('editProfile.success') });
          reset({
            firstName: data.firstName,
            secondName: data.secondName,
            username: '@' + data.username,
            email: data.email,
            description: data.description,
          });
        },
        onError: (error) => {
          add({
            message: t('editProfile.error', { message: error.message }),
            type: 'error',
          });
        },
      },
    );
  };

  const shouldConfirmPassword = (data: EditProfileSchema) => {
    if (dirtyFields.email) {
      openConfirm();
    } else {
      saveChanges(data);
    }
  };

  if(!isMounted) {
    return <Loader/>
  }

  return (
    <section className="edit-profile">
      <h2>{t('editProfile.title')}</h2>
      <div className="profile-row profile-avatar">
        <Avatar size={92} src={user?.avatar || ""} alt="your avatar" />
        <div className="user-info">
          <div>
            {user?.name || ""} {user?.surname || ""}
          </div>
          <CoverButton onClick={openUpdateImage}>
            <span>{t('editProfile.changePhoto')}</span>
          </CoverButton>
          <UpdateProfileImageModal
            isOpen={isUpdateImageOpen}
            onClose={closeUpdateImage}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit(shouldConfirmPassword)} noValidate>
        <Controller
          name="firstName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              label={t('editProfile.firstName')}
              placeholder={t('editProfile.firstNamePlaceholder')}
              icon={<UserIcon />}
              error={error?.message}
              custom
            />
          )}
        />
        <Controller
          name="secondName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              label={t('editProfile.secondName')}
              placeholder={t('editProfile.secondNamePlaceholder')}
              icon={<UserIcon />}
              error={error?.message}
              custom
            />
          )}
        />
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              label={t('editProfile.username')}
              name="username"
              type="text"
              placeholder="@username"
              icon={<UserIcon />}
              error={error?.message}
              custom
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              label={t('editProfile.email')}
              placeholder={t('editProfile.emailPlaceholder')}
              icon={<MailIcon />}
              error={error?.message}
              custom
            />
          )}
        />
        <ConfirmPasswordModal
          newEmail={emailValue}
          isOpen={isConfirmOpen}
          onClose={closeConfirm}
          onSuccess={handleSubmit(saveChanges)}
        />
        <div>
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextArea
                {...field}
                label={t('editProfile.description')}
                name="description"
                icon={<Pen />}
                info={t('editProfile.maxChars')}
                placeholder={t('editProfile.descriptionPlaceholder')}
                errorMessage={error?.message}
              />
            )}
          />
        </div>
        <Button
          disabled={isPending}
          type="submit"
          className="save-profile-button"
        >
          {t('editProfile.submit')}
        </Button>
      </form>
    </section>
  );
};
