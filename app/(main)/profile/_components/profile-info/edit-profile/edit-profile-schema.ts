import { z } from 'zod';
import i18n from '@/shared/config/i18n';

const MAX_DESCRIPTION_LENGTH = 200;
const MAX_NAME_LENGTH = 15;

export const editProfileSchema = () =>
  z.object({
    firstName: z
      .string()
      .max(
        MAX_NAME_LENGTH,
        i18n.t('validation.firstNameMax', {
          ns: 'profile',
          count: MAX_NAME_LENGTH,
        }),
      )
      .min(
        1,
        i18n.t('validation.firstNameRequired', {
          ns: 'profile',
        }),
      ),
    secondName: z
      .string()
      .max(
        MAX_NAME_LENGTH,
        i18n.t('validation.secondNameMax', {
          ns: 'profile',
          count: MAX_NAME_LENGTH,
        }),
      )
      .min(
        1,
        i18n.t('validation.secondNameRequired', {
          ns: 'profile',
        }),
      ),
    username: z
      .string()
      .regex(/^@/, i18n.t('validation.usernameStart', { ns: 'profile' }))
      .min(4, i18n.t('validation.usernameMin', { ns: 'profile' }))
      .max(20, i18n.t('validation.usernameMax', { ns: 'profile' })),
    email: z
      .string()
      .min(1, i18n.t('validation.emailRequired', { ns: 'profile' }))
      .email(i18n.t('validation.emailInvalid', { ns: 'profile' })),
    description: z.string().max(
      MAX_DESCRIPTION_LENGTH,
      i18n.t('validation.descriptionMax', {
        ns: 'profile',
        count: MAX_DESCRIPTION_LENGTH,
      }),
    ),
  });

export type EditProfileSchema = z.infer<ReturnType<typeof editProfileSchema>>;
