const LANGUAGE_STORAGE_KEY = "customer-language-preference";

export const SUPPORTED_LANGUAGES = ["en", "no"];
export const DEFAULT_LANGUAGE = "en";

export function normalizeLanguage(value) {
  if (SUPPORTED_LANGUAGES.includes(value)) {
    return value;
  }

  return DEFAULT_LANGUAGE;
}

export function readSavedLanguage() {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
}

export function writeSavedLanguage(language) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    LANGUAGE_STORAGE_KEY,
    normalizeLanguage(language),
  );
}
