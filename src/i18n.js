import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en/translation.json';
import sqTranslations from './locales/sq/translation.json'; 
import srTranslations from './locales/sr/translation.json';

// Perdorimi i detektorit te gjuhes dhe inicializimi i librarise React i18next
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {translation: enTranslations}, // Perkthimet ne anglisht
            sq: {translation: sqTranslations}, // Perkthimet ne shqip
            sr: {translation: srTranslations}  // Perkthimet ne serbisht
        },
        fallbackLng: 'en', // Gjuha rezerve nese perkthimi nuk gjendet
        interpolation: {
      escapeValue: false
        }
  });

export default i18n;