import { useTranslations } from "next-intl";
import { ThemeSwitcher } from '@/features/theme-switcher';
import { EditProfile } from './edit-profile';
import './profile-info.css';
import { LanguageSwitcher } from '@/features/language-switcher';
import { LogoutButton } from "./logout-button";

export const ProfileInfo = () => {
  const t = useTranslations('profile');

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
          <LogoutButton/>
        </section>
      </div>

      <div className="profile-edit-section">
        <EditProfile />
      </div>
    </div>
  );
};
