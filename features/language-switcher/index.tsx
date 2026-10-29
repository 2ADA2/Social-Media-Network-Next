'use client';

import { useLocale, useTranslations } from "next-intl";
import './language-switcher.css';
import type { ChangeEvent } from 'react';
import { useRouter } from "next/navigation";

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
] as const;

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();

  const changeLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
    document.cookie = `NEXT_LOCALE=${e.target.value}; path=/; max-age=31536000; SameSite=Lax`;

    router.refresh();
  };

  return (
    <select
      className="language-switcher"
      value={locale}
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
