import parser from "accept-language-parser";

import { SUPPORTED_LANGUAGES } from "@acme/translations";

/**
 * Check if a value is a record.
 * @param value
 * @returns
 */
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

/**
 * Find a language supported by the server from the Accept-Language header.
 * @param acceptLanguageHeader
 * @returns The supported language or null if none is found.
 */
export const findSupportedLanguage = (acceptLanguageHeader: string) =>
  parser.pick(SUPPORTED_LANGUAGES, acceptLanguageHeader, {
    loose: true,
  });
