import { z } from 'zod';
import type { TFunction } from 'i18next';

export const createSignupSchema = (t: TFunction<'auth'>) =>
  z.object({
    firstName: z
      .string()
      .min(1, t('validation.firstNameRequired'))
      .max(15, t('validation.firstNameMax')),
    secondName: z
      .string()
      .min(1, t('validation.secondNameRequired'))
      .max(15, t('validation.secondNameMax')),
    email: z
      .string()
      .min(1, t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    password: z
      .string()
      .min(8, t('validation.passwordMin'))
      .regex(/[a-zA-Z]/, t('validation.passwordLetter'))
      .regex(/[0-9]/, t('validation.passwordDigit')),
  });

export type SignUpFormData = z.infer<ReturnType<typeof createSignupSchema>>;
