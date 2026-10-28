import { useTranslation } from 'react-i18next';
import { ThemeSwitcher } from '@/features/theme-switcher';
import { Button } from '@/shared/ui/button';
import { EditProfile } from './edit-profile';
import './profile-info.css';
import { useAuth } from '@/features/auth/use-auth';
import { LanguageSwitcher } from '@/features/language-switcher';

export const ProfileInfo = () => {
  const { t } = useTranslation('profile');
  const { logout } = useAuth();

  return (
    <div className="profile-grid">
      <div className="profile-column profile-info">
        <section>
          <h2>{t('preferences.title')}</h2>
          <div className="switcher-container">
            <ThemeSwitcher /> {t('preferences.darkTheme')}
          </div>
          <div className="select-container">
            <LanguageSwitcher />
          </div>
        </section>
        <section>
          <h2>{t('actions.title')}</h2>
          <Button className="logout-button" onClick={logout}>
            {t('actions.logout')}
          </Button>
        </section>
      </div>

      <div className="profile-edit-section">
        <EditProfile />
      </div>
    </div>
  );
};
