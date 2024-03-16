import type { Client } from "../client";
import { en } from "./en";
import { mi } from "./mi";

export const EMAIL_NS = "email";

export const email: Record<keyof Client, typeof en> = {
  en,
  mi,
};

export type Email = typeof email;
