import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get('NEXT_LOCALE')?.value || 'en';

  return {
    locale,
    messages: {
      common: (await import(`../messages/${locale}/common.json`)).default,
      auth: (await import(`../messages/${locale}/auth.json`)).default,
      profile: (await import(`../messages/${locale}/profile.json`)).default,
      main: (await import(`../messages/${locale}/main.json`)).default,
      'not-found': (await import(`../messages/${locale}/not-found.json`)).default,
    },
  };
}); 