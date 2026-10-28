import { TextArea } from '@/shared/ui/text-area';
import { Button } from '@/shared/ui/button';
import PenIcon from '@/shared/assets/icons/pen.svg';
import { type ChangeEvent, useState } from 'react';
import { useLocale, useTranslations } from "next-intl";
import './create-comment.css';
import { useCreateComment } from '@/features/create-comment/use-create-comment';
import { useNotifications } from '@/app/providers/notifications-provider/useNotifications';

interface CreateCommentProps {
  postId: number;
}

export const CreateComment = ({ postId }: CreateCommentProps) => {
  const { add } = useNotifications();
  const t = useTranslations('main');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const { mutate: requestCreateComment, isPending } = useCreateComment();

  const check = (length: number) => {
    if (1 > length || length > 200) {
      setError(t('comment.lengthError'));
      return false;
    }

    setError('');
    return true;
  };

  const changeComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    check(e.target.value.length);
  };

  const createComment = () => {
    if (check(comment.length)) {
      requestCreateComment(
        { text: comment, postId: postId },
        {
          onSuccess: () => {
            add({ message: t('comment.successMessage') });
            setComment('');
          },
          onError: () => {
            add({ message: t('comment.errorMessage'), type: 'error' });
          },
        },
      );
    }
  };

  return (
    <div className="add-comment-section">
      <TextArea
        icon={<PenIcon />}
        label={t('comment.label')}
        placeholder={t('comment.placeholder')}
        onChange={changeComment}
        value={comment}
        errorMessage={error}
        disabled={isPending}
      />
      <Button disabled={isPending} type="button" onClick={createComment}>
        {t('comment.submit')}
      </Button>
    </div>
  );
};
