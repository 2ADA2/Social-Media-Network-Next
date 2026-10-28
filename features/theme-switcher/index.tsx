import { Toggle } from '@/shared/ui/toggle';
import { useThemeStore } from '@/app/store/theme-store';
import { useTranslation } from 'react-i18next';

export const ThemeSwitcher = () => {
  const { t } = useTranslation('profile');
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
