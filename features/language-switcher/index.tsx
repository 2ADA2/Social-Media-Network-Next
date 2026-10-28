import { useTranslation } from 'react-i18next';
import './language-switcher.css';
import type { ChangeEvent } from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
] as const;

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select
      className="language-switcher"
      value={i18n.language.split('-')[0]}
      onChange={changeLanguage}
      aria-label="Language"
      name="language"
    >
      {LANGUAGES.map(({ code, label }) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
};
