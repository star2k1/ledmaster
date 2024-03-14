import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import et from '../locales/et.json';

export const languageResources = {
	en: { translation: en },
	et : { translation: et}
};

i18next.use(initReactI18next).init({
	compatibilityJSON: 'v3',
	lng: 'et',
	fallbackLng: 'en',
	resources: languageResources,
});

export default i18next;