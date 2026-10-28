import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/ui/modal';
import { StyledTitle } from '@/features/create-post/create-post-modal/create-post-modal.styles';
import { Button } from '@/shared/ui/button';

export interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isPending: boolean;
}

export const DeletePostModal = ({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}: DeletePostModalProps) => {
  const { t } = useTranslation('main');

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="delete-post-modal">
      <StyledTitle>{t('deletePost.title')}</StyledTitle>
      <Button disabled={isPending} onClick={handleSubmit}>
        {t('deletePost.submit')}
      </Button>
    </Modal>
  );
};
