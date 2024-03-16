import type { SupportedLanguage } from "..";
import { en } from "./en";
import { mi } from "./mi";

export const EMAIL_NS = "email";

export const email: Record<SupportedLanguage, typeof en> = {
  en,
  mi,
};

export type Email = typeof email;
