'use client';

import { Toggle } from '@/shared/ui/toggle';
import { useThemeStore } from '@/app/store/theme-store';
import { useTranslations } from "next-intl";

export const ThemeSwitcher = () => {
  const t = useTranslations('profile');
  const { theme, toggleTheme } = useThemeStore((state) => state);

  const checked = theme === 'dark';

  return (
    <Toggle
      checked={checked}
      onChange={toggleTheme}
      label={t('preferences.switchTheme')}
    />
  );
};
