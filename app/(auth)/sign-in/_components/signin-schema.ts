import { z } from 'zod';
import { useTranslations } from 'next-intl';

type TFunction = ReturnType<typeof useTranslations<'auth'>>;

export const createSignInSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .min(1, t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    password: z
      .string()
      .min(1, t('validation.passwordRequired'))
      .min(8, t('validation.passwordMin')),
  });

export type SignInFormData = z.infer<ReturnType<typeof createSignInSchema>>;
