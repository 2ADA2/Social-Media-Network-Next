import i18n, { type FormatFunction, type InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enNotFound from './locales/en/not-found.json';
import enMain from './locales/en/main.json';
import enProfile from './locales/en/profile.json';

import ruCommon from './locales/ru/common.json';
import ruAuth from './locales/ru/auth.json';
import ruNotFound from './locales/ru/not-found.json';
import ruMain from './locales/ru/main.json';
import ruProfile from './locales/ru/profile.json';

const format: FormatFunction = (value, formatKey, lng) => {
  if (formatKey === 'compact' && typeof value === 'number') {
    return new Intl.NumberFormat(lng, {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }

  return String(value);
};

const options: InitOptions = {
  fallbackLng: 'en',
  supportedLngs: ['en', 'ru'],
  defaultNS: 'common',
  resources: {
    en: {
      common: enCommon,
      auth: enAuth,
      main: enMain,
      profile: enProfile,
      'not-found': enNotFound,
    },
    ru: {
      common: ruCommon,
      auth: ruAuth,
      main: ruMain,
      profile: ruProfile,
      'not-found': ruNotFound,
    },
  },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
    lookupLocalStorage: 'i18nextLng',
  },
  interpolation: {
    escapeValue: false,
    format,
  },
} as InitOptions;

i18n.use(LanguageDetector).use(initReactI18next).init(options);

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;
