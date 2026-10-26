import { z } from 'zod';
import type { TFunction } from 'i18next';

export const createSignInSchema = (t: TFunction<'auth'>) =>
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
