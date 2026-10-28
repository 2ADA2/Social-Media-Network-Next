import { type ChangeEvent, useState } from 'react';
import { useTranslations } from "next-intl";
import { StyledTitle } from '@/features/create-post/create-post-modal/create-post-modal.styles';
import { FileInput } from '@/shared/ui/file-input';
import { StyledButton } from '@/features/create-post/create-post.styles';
import { useUpdateAvatar } from '@/features/edit-profile/use-update-avatar';
import { Modal } from '@/shared/ui/modal';
import { useNotifications } from '@/app/providers/notifications-provider/useNotifications';

const MAX_SIZE_MB = 2;
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

export interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateProfileImageModal = ({
  isOpen,
  onClose,
}: CreateModalProps) => {
  const t = useTranslations('profile');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const { add } = useNotifications();

  const { mutate: updateAvatar, isPending } = useUpdateAvatar();

  const changeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (!selectedFile) {
      setFile(null);
      setFileName('');
      return;
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      add({ message: t('updateAvatar.fileTypeError'), type: 'error' });
      e.target.value = '';
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_SIZE) {
      add({
        message: t('updateAvatar.fileSizeError', { size: MAX_SIZE_MB }),
        type: 'error',
      });
      e.target.value = '';
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const updateProfileImage = () => {
    if (!file) {
      add({ message: t('updateAvatar.noFile'), type: 'error' });
      return;
    }
    updateAvatar(file, {
      onSuccess: () => {
        add({ message: t('updateAvatar.success') });
        onClose();
      },
      onError: (error) => {
        add({
          message: t('updateAvatar.error', { message: error.message }),
          type: 'error',
        });
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <StyledTitle>{t('updateAvatar.title')}</StyledTitle>
      <FileInput
        name="image"
        hasPDF={false}
        maxSize={MAX_SIZE_MB}
        fileName={fileName}
        onChange={changeFile}
      />
      <StyledButton
        disabled={isPending}
        type="submit"
        onClick={updateProfileImage}
      >
        {t('updateAvatar.submit')}
      </StyledButton>
    </Modal>
  );
};
