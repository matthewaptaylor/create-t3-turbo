import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import mjml2html from "mjml";

import type { ParseKeys } from "@acme/client-translations";

import { i18n } from "../globals";

export type TemplateFn<T> = (payload: T, lng: string) => string;

/**
 * Import a text file relative to this file.
 * @param filename
 * @returns
 */
export const importText = (filename: string) =>
  fs.readFileSync(path.join(__dirname, filename), "utf-8");

/**
 * Import an MJML file relative to this file.
 * @param filename
 * @returns
 */
export const importMjml = (filename: string) =>
  mjml2html(fs.readFileSync(path.join(__dirname, filename), "utf-8")).html;

/**
 * Create a function that generates an email.
 * @param template The handlebars template for the email.
 * @param keys The translation keys to make available in the email template.
 * @returns A function that generates an email.
 */
export const createTemplate = <T>(
  template: string,
  keys: ParseKeys<"email">[],
) => {
  const handlebarsFn = Handlebars.compile(template);

  /**
   * Generate an email from a template.
   * @param payload The data to be sent in the email.
   * @param lng The language to use for the translations.
   * @returns The generated email.
   */
  const templateFn: TemplateFn<T> = (payload: T, lng: string) => {
    // Create a translation payload for the email
    const translationPayload: Partial<Record<(typeof keys)[number], string>> =
      {};
    let key: (typeof keys)[number];
    for (key of keys) {
      translationPayload[key] = i18n.t(key, {
        ns: "email",
        lng,
      });
    }

    return handlebarsFn({
      ...payload,
      t: translationPayload,
    });
  };

  return templateFn;
};
