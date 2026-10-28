import { useTranslation } from 'react-i18next';
import TrashCanIcon from '@/shared/assets/icons/trashcan.svg';
import './delete-post-button.css';
import { useDeletePost } from '@/features/delete-post/use-delete-post';
import { DeletePostModal } from '@/features/delete-post/ui/delete-post-modal';
import { useModal } from '@/shared/lib/hooks/use-modal';

export interface DeletePostButtonProps {
  postId: number;
}

export const DeletePostButton = ({ postId }: DeletePostButtonProps) => {
  const { t } = useTranslation('main');
  const { mutate: deletePost, isPending } = useDeletePost();
  const { isOpen, open, close } = useModal();

  const handleDelete = () => {
    deletePost(postId, {
      onSuccess: () => {
        close();
      },
    });
  };

  return (
    <>
      <DeletePostModal
        isOpen={isOpen}
        onClose={close}
        onSubmit={handleDelete}
        isPending={isPending}
      />
      <button
        type="button"
        className="delete-post-button"
        disabled={isPending}
        onClick={open}
        aria-label={t('post.delete')}
      >
        <TrashCanIcon aria-hidden="true" />
      </button>
    </>
  );
};
