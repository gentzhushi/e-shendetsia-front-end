import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en/translation.json';
import sqTranslations from './locales/sq/translation.json'; 
import srTranslations from './locales/sr/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      sq: { translation: sqTranslations },
      sr: { translation: srTranslations } 
    },
    // fallbackLng: 'en',
    fallbackLng: 'sq',
    // fallbackLng: 'sr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;