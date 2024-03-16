import type { Resource } from "i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import type { Translation } from "./translation";
import { translation, TRANSLATION_NS } from "./translation";

export * from "react-i18next";

export type SupportedLanguage = keyof Translation;
export const SUPPORTED_LANGUAGES = Object.keys(
  translation,
) as SupportedLanguage[];

const DEFAULT_LANG = "en"; // The language all types are based on

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof TRANSLATION_NS;
    resources: {
      [TRANSLATION_NS]: Translation[SupportedLanguage];
    };
  }
}

/**
 * Setup i18n.
 */
export const setupI18n = async () => {
  const resources: Resource = {};
  let lang: SupportedLanguage;
  for (lang in translation) {
    resources[lang] = {
      [TRANSLATION_NS]: translation[lang],
    };
  }

  await i18n.use(initReactI18next).init({
    resources,
    defaultNS: TRANSLATION_NS,
    lng: DEFAULT_LANG,
    fallbackLng: DEFAULT_LANG,
    interpolation: {
      escapeValue: false,
    },
  });
};

export { i18n };
