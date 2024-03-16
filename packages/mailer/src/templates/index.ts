import type { EmailTemplate } from "..";
import { createTemplate, importMjml, importText } from "./utils";

export interface VerifyEmailPayload {
  link: string;
}

/**
 * An email sent to a user with a link to verify their email address.
 */
export const verifyEmailTemplate: EmailTemplate<VerifyEmailPayload> = {
  text: createTemplate(importText("verify.txt.hbs"), [
    "companyName",
    "address",
    "verifyEmailSubject",
    "verifyEmailMessage",
    "verifyEmailButton",
  ]),
  html: createTemplate(importMjml("verify.mjml.hbs"), [
    "address",
    "verifyEmailSubject",
    "verifyEmailMessage",
    "verifyEmailButton",
  ]),
};
