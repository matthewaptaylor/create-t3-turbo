import type { Resource } from "i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import type { Client } from "./client";
import type { Email } from "./email";
import { client, CLIENT_NS } from "./client";
import { email, EMAIL_NS } from "./email";

export * from "react-i18next";

export type I18n = typeof i18n;
export type { ParseKeys, TFunction } from "i18next";

export { CLIENT_NS, EMAIL_NS };

export const DEFAULT_LANG = "en"; // The language all types are based on

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof CLIENT_NS;
    resources: {
      [CLIENT_NS]: Client[keyof Client];
      [EMAIL_NS]: Email[keyof Email];
    };
  }
}

/**
 * Setup i18n.
 */
export const setupI18n = async () => {
  const resources: Resource = {};
  let lang: keyof Client;
  for (lang in client) {
    resources[lang] = {
      [CLIENT_NS]: client[lang],
      [EMAIL_NS]: email[lang],
    };
  }

  await i18n.use(initReactI18next).init({
    resources,
    defaultNS: CLIENT_NS,
    lng: DEFAULT_LANG,
    fallbackLng: DEFAULT_LANG,
    interpolation: {
      escapeValue: false,
    },
  });
};

export { i18n };
