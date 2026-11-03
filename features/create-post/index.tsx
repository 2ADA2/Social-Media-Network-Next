import { useTranslations } from "next-intl";
import { Card, Text, StyledButton, StyledAvatar } from './create-post.styles';
import { CreatePostModal } from '@/features/create-post/create-post-modal/create-post-modal';
import { useAuth } from '@/features/auth/use-auth';
import { useUser } from '@/entities/user/model/use-user';
import { useModal } from '@/shared/lib/hooks/use-modal';

interface CreatePostProps {
  onAdd: (postId: number) => void;
}

export const CreatePost = ({ onAdd }: CreatePostProps) => {
  const t = useTranslations('main');
  const { isAuth } = useAuth();
  const { user } = useUser();

  const { isOpen, open, close } = useModal();

  if (!isAuth) {
    return null;
  }

  return (
    <Card>
      <StyledAvatar src={user!.avatar} size={32} />
      <Text>{t('createPost.placeholder')}</Text>
      <StyledButton onClick={open}>{t('createPost.submit')}</StyledButton>

      <CreatePostModal isOpen={isOpen} onClose={close} onAdd={onAdd} />
    </Card>
  );
};
