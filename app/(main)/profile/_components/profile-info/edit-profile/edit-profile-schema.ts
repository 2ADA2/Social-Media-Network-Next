import { z } from 'zod';

const MAX_DESCRIPTION_LENGTH = 200;
const MAX_NAME_LENGTH = 15;

type Translator = (
  key: string,
  values?: Record<string, string | number | Date>,
) => string;

export const editProfileSchema = (t: Translator) =>
  z.object({
    firstName: z
      .string()
      .max(
        MAX_NAME_LENGTH,
        t('validation.firstNameMax', { count: MAX_NAME_LENGTH }),
      )
      .min(1, t('validation.firstNameRequired')),
    secondName: z
      .string()
      .max(
        MAX_NAME_LENGTH,
        t('validation.secondNameMax', { count: MAX_NAME_LENGTH }),
      )
      .min(1, t('validation.secondNameRequired')),
    username: z
      .string()
      .regex(/^@/, t('validation.usernameStart'))
      .min(4, t('validation.usernameMin'))
      .max(20, t('validation.usernameMax')),
    email: z
      .string()
      .min(1, t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    description: z.string().max(
      MAX_DESCRIPTION_LENGTH,
      t('validation.descriptionMax', { count: MAX_DESCRIPTION_LENGTH }),
    ),
  });

export type EditProfileSchema = z.infer<ReturnType<typeof editProfileSchema>>;