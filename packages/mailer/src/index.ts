import type { SendEmailV3_1 } from "node-mailjet";

import type { TemplateFn } from "./templates/utils";
import { i18n, mailjet } from "./globals";

/**
 * Data to be sent in an email.
 */
export interface EmailData<T> {
  from: SendEmailV3_1.EmailAddressTo;
  to: SendEmailV3_1.EmailAddressTo[];
  subject: string;
  payload: T;
}

/**
 * A handlebars template for an email, with text and HTML parts.
 */
export interface EmailTemplate<T> {
  text: TemplateFn<T>;
  html: TemplateFn<T>;
}

/**
 * Send an email using Mailjet.
 * @param mailjet A Mailjet client.
 * @param data Data to be sent in the email.
 * @param template A handlebars template for the email.
 * @returns
 */
export const sendEmail = <T extends Record<string, unknown>>(
  data: EmailData<T>,
  template: EmailTemplate<T>,
  lng: string,
) => {
  if (!mailjet || !i18n)
    throw new Error("sendEmail called before mailer was initialized.");

  console.log("data", data);

  console.log("text", template.text(data.payload, lng));
  console.log("html", template.html(data.payload, lng));

  i18n.t("address", { ns: "email" });

  const body: SendEmailV3_1.Body = {
    Messages: [
      {
        From: data.from,
        To: data.to,
        Subject: data.subject,
        TextPart: template.text(data.payload, lng),
        HTMLPart: template.html(data.payload, lng),
        CustomID: "BasicEmail",
      },
    ],
  };

  return mailjet.post("send", { version: "v3.1" }).request(body);
};

export { initMailer } from "./globals";

export { verifyEmailTemplate as basicEmailTemplate } from "./templates/index";
export type { VerifyEmailPayload } from "./templates/index";
