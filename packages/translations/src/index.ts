import type { Resource } from "i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import type { en } from "./locales/en";
import { locales } from "./locales";

export * from "react-i18next";

export const DEFAULT_LANG = "en"; // The language all types are based on
export const DEFAULT_NS = "translation";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof DEFAULT_NS;
    resources: {
      [DEFAULT_NS]: typeof en;
    };
  }
}

/**
 * Setup i18n.
 */
export const setupI18n = async () => {
  const resources: Resource = {};
  let lang: keyof typeof locales;
  for (lang in locales) {
    resources[lang] = { [DEFAULT_NS]: locales[lang] };
  }

  await i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANG,
    fallbackLng: DEFAULT_LANG,
    interpolation: {
      escapeValue: false,
    },
  });
};

export { i18n };
