import type { Resource } from "i18next";
import i18n from "i18next";

import type { Email } from "./email";
import { email, EMAIL_NS } from "./email";

export * from "react-i18next";

export type I18n = typeof i18n;
export type { ParseKeys } from "i18next";

export type SupportedLanguage = keyof Email;
export const SUPPORTED_LANGUAGES = Object.keys(email) as SupportedLanguage[];

const DEFAULT_LANG = "en"; // The language all types are based on

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof EMAIL_NS;
    resources: {
      [EMAIL_NS]: Email[SupportedLanguage];
    };
  }
}

/**
 * Setup i18n.
 */
export const setupI18n = async () => {
  const resources: Resource = {};
  let lang: SupportedLanguage;
  for (lang in email) {
    resources[lang] = {
      [EMAIL_NS]: email[lang],
    };
  }

  await i18n.init({
    resources,
    defaultNS: EMAIL_NS,
    lng: DEFAULT_LANG,
    fallbackLng: DEFAULT_LANG,
    interpolation: {
      escapeValue: false,
    },
  });
};

export { i18n };
