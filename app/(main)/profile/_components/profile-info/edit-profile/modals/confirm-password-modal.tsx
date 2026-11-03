import { useState } from 'react';
import { useTranslations } from "next-intl";
import { Modal } from '@/shared/ui/modal';
import { StyledTitle } from '@/features/create-post/create-post-modal/create-post-modal.styles';
import { Button } from '@/shared/ui/button';
import { useUpdateAccount } from '@/features/edit-profile/use-update-account';
import { useNotifications } from '@/app/providers/notifications-provider/useNotifications';
import axios from 'axios';
import { PasswordInput } from '@/shared/ui/password-input';

interface ConfirmPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  newEmail: string;
}

export const ConfirmPasswordModal = ({
  isOpen,
  onClose,
  onSuccess,
  newEmail,
}: ConfirmPasswordModalProps) => {
  const t = useTranslations('profile');
  const [password, setPassword] = useState('');
  const { add } = useNotifications();

  const { mutate: updateAccount, isPending } = useUpdateAccount();

  const handleSubmit = () => {
    if (!password) {
      add({
        message: t('confirmPassword.required'),
        type: 'error',
      });
      return;
    }

    updateAccount(
      { currentPassword: password, email: newEmail },
      {
        onSuccess: () => {
          setPassword('');
          onSuccess();
          onClose();
          add({ message: t('editProfile.emailSuccess') });
        },
        onError: (error) => {
          if (!axios.isAxiosError(error)) {
            add({
              message: t('editProfile.error', { message: String(error) }),
              type: 'error',
            });
            return;
          }

          const status = error.response?.status;
          const code = error.response?.data?.code;
          const serverMessage = error.response?.data?.message;

          if (status === 403 || code === 'INVALID_CURRENT_PASSWORD') {
            add({
              message: t('confirmPassword.wrongPassword'),
              type: 'error',
            });
            return;
          }

          if (status === 409 || code === 'EMAIL_TAKEN') {
            add({
              message: t('confirmPassword.emailTaken'),
              type: 'error',
            });
            return;
          }

          if (status === 400 || code === 'VALIDATION_FAILED') {
            add({
              message: serverMessage || t('confirmPassword.validationError'),
              type: 'error',
            });
            return;
          }

          add({
            message:
              serverMessage ||
              t('editProfile.error', { message: error.message }),
            type: 'error',
          });
        },
      },
    );
  };

  const handleClose = () => {
    setPassword('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <StyledTitle>{t('confirmPassword.title')}</StyledTitle>

      <PasswordInput
        label={t('confirmPassword.password')}
        placeholder={t('confirmPassword.passwordPlaceholder')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button type="button" disabled={isPending} onClick={handleSubmit}>
        {t('confirmPassword.submit')}
      </Button>
    </Modal>
  );
};
