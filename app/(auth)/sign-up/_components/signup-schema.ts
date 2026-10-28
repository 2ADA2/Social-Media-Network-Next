import { useTranslations } from 'next-intl';
import { z } from 'zod';


type TFunction = ReturnType<typeof useTranslations<'auth'>>;

export const createSignupSchema = (t: TFunction) =>
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
