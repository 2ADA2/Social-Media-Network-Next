import { z } from 'zod';
import i18n from '@/shared/config/i18n';

const MAX_DESCRIPTION_LENGTH = 1000;

export const createPostSchema = () =>
  z.object({
    title: z
      .string()
      .min(2, i18n.t('validation.titleMin', { ns: 'main' }))
      .max(100, i18n.t('validation.titleMax', { ns: 'main' })),
    description: z
      .string()
      .min(1, i18n.t('validation.descriptionMin', { ns: 'main' }))
      .max(
        MAX_DESCRIPTION_LENGTH,
        i18n.t('validation.descriptionMax', {
          ns: 'main',
          count: MAX_DESCRIPTION_LENGTH,
        }),
      ),
  });

export type CreatePostData = z.infer<ReturnType<typeof createPostSchema>>;
