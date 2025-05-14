/**
 * Ky file permban konfigurimin e internationalizimit per aplikacionin
 *
 * Pershkrimi i pergjithshem:
 * - Perdoret libraria i18next per menaxhimin e gjuheve
 * - Mundeson detektimin automatik te gjuhes nga shfletuesi
 * - Permban perkthimet per gjuhet: anglisht, shqip dhe serbisht
 * - Perdor JSON files per ruajtjen e perkthimeve
 * - Gjuha e parazgjedhur (fallback) eshte anglishtja
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en/translation.json';
import sqTranslations from './locales/sq/translation.json'; 
import srTranslations from './locales/sr/translation.json';

// Perdorimi i detektorit te gjuhes dhe inicializimi i librarise React i18next
i18n
<<<<<<< HEAD
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
=======
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
>>>>>>> e2bd9f7530ba452ca702cba307184c9115fc34bf
      escapeValue: false
        }
  });

export default i18n;