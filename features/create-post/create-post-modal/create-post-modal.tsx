import { type ChangeEvent, useMemo, useState } from 'react';
import MailIcon from '@/shared/assets/icons/mail.svg';
import PenIcon from '@/shared/assets/icons/pen.svg';
import { FileInput } from '@/shared/ui/file-input';
import { useLocale, useTranslations } from "next-intl";
import {
  StyledForm,
  StyledInput,
  StyledTextArea,
  StyledTitle,
} from '@/features/create-post/create-post-modal/create-post-modal.styles';
import { StyledButton } from '@/features/create-post/create-post.styles';
import { Controller, useForm } from 'react-hook-form';
import {
  createPostSchema,
  type CreatePostData,
} from '@/features/create-post/create-post-modal/create-post-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePost } from '@/features/create-post/hooks/use-create-post';
import { Modal } from '@/shared/ui/modal';
import { useNotifications } from '@/app/providers/notifications-provider/useNotifications';

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];

export interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (postId: number) => void;
}

export const CreatePostModal = ({
  isOpen,
  onClose,
  onAdd,
}: CreateModalProps) => {
  const t = useTranslations('main');
  const locale = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const { add } = useNotifications();

  const { mutate: createPost } = useCreatePost();

  const schema = useMemo(() => createPostSchema(t), [locale]);

  const { control, handleSubmit, reset } = useForm<CreatePostData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '' },
    mode: 'onTouched',
  });

  const changeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (!selectedFile) {
      setFile(null);
      setFileName('');
      return;
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      add({ message: t('createPostModal.fileTypeError'), type: 'error' });
      e.target.value = '';
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_SIZE) {
      add({ message: t('createPostModal.fileSizeError'), type: 'error' });
      e.target.value = '';
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const submitForm = (data: CreatePostData) => {
    createPost(
      { title: data.title, content: data.description, file },
      {
        onSuccess: (newPost) => {
          reset();
          setFile(null);
          setFileName('');
          onClose();
          add({ message: t('createPostModal.success') });
          onAdd(newPost.id);
        },
        onError: (e) => {
          add({
            message: t('createPostModal.error', { message: e.message }),
            type: 'error',
          });
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <StyledForm onSubmit={handleSubmit(submitForm)} noValidate>
        <StyledTitle>{t('createPostModal.title')}</StyledTitle>
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <StyledInput
              {...field}
              icon={<MailIcon />}
              label={t('createPostModal.titleLabel')}
              name="title"
              error={error?.message}
              placeholder={t('createPostModal.titlePlaceholder')}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <StyledTextArea
              $filled={!!error?.message}
              {...field}
              icon={<PenIcon />}
              label={t('createPostModal.descriptionLabel')}
              name="description"
              placeholder={t('createPostModal.descriptionPlaceholder')}
              errorMessage={error?.message}
            />
          )}
        />
        <FileInput name="image" fileName={fileName} onChange={changeFile} />
        <StyledButton type="submit">{t('createPostModal.submit')}</StyledButton>
      </StyledForm>
    </Modal>
  );
};
