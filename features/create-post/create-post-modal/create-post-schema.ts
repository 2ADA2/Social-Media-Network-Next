import { z } from 'zod';

const MAX_DESCRIPTION_LENGTH = 1000;

type Translator = (
  key: string,
  values?: Record<string, string | number | Date>,
) => string;

export const createPostSchema = (t: Translator) =>
  z.object({
    title: z
      .string()
      .min(2, t('validation.titleMin'))
      .max(100, t('validation.titleMax')),
    description: z
      .string()
      .min(1, t('validation.descriptionMin'))
      .max(
        MAX_DESCRIPTION_LENGTH,
        t('validation.descriptionMax', { count: MAX_DESCRIPTION_LENGTH }),
      ),
  });

export type CreatePostData = z.infer<ReturnType<typeof createPostSchema>>;