import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import af from './locales/af.json';
import zu from './locales/zu.json';
import xh from './locales/xh.json';
import st from './locales/st.json';
import tn from './locales/tn.json';
import nso from './locales/nso.json';
import nr from './locales/nr.json';
import ss from './locales/ss.json';
import ve from './locales/ve.json';
import ts from './locales/ts.json';

const resources = {
  en: { translation: en },
  af: { translation: af },
  zu: { translation: zu },
  xh: { translation: xh },
  st: { translation: st },
  tn: { translation: tn },
  nso: { translation: nso },
  nr: { translation: nr },
  ss: { translation: ss },
  ve: { translation: ve },
  ts: { translation: ts },
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

