import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import sw from './locales/sw.json';

const resources = {
  en: { translation: en },
  sw: { translation: sw },
};

const supportedLngs = Object.keys(resources);

function getInitialLng() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('i18nextLng');
    if (stored && supportedLngs.includes(stored)) return stored;
    const browser = navigator.language?.split('-')[0];
    if (browser && supportedLngs.includes(browser)) return browser;
  }
  return 'en';
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLng(),
    fallbackLng: 'en',
    supportedLngs,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

