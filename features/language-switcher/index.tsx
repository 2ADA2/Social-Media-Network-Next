"use client";

import { useLocale } from "next-intl";
import "./language-switcher.css";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/shared/ui/select";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
] as const;

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();

  const changeLanguage = (value: string) => {
    document.cookie = `NEXT_LOCALE=${value}; path=/; max-age=7200; SameSite=Lax`;

    router.refresh();
  };

  return (
    <Select
      options={LANGUAGES.map(({ code, label }) => ({
        value: code,
        label: label,
      }))}
      value={locale}
      onChange={changeLanguage}
    />
  );
};
