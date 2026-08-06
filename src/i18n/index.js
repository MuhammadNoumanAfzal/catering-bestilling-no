import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE, readSavedLanguage } from "./languagePreferences";
import en from "./locales/en";
import no from "./locales/no";

const resources = {
  en: {
    translation: en,
  },
  no: {
    translation: no,
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: readSavedLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  });
}

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language;
  document.documentElement.translate = false;
  document.documentElement.classList.add("notranslate");
  document.body?.classList.add("notranslate");
}

i18n.on("languageChanged", (language) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = language;
    document.documentElement.translate = false;
    document.documentElement.classList.add("notranslate");
    document.body?.classList.add("notranslate");
  }
});

export default i18n;
