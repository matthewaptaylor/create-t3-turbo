import type { SendEmailV3_1 } from "node-mailjet";
import mustache from "mustache";
import { Client } from "node-mailjet";

export { basicEmailTemplate } from "./templates/basic";

let mailjet: Client;

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
 * A mustache template for an email, with text and HTML parts.
 */
export interface EmailTemplate<_T> {
  text: string;
  html: string;
}

/**
 * Create a new Mailjet client.
 * @param apiKey
 * @param apiSecret
 * @returns
 */
export const initMailer = (apiKey: string, apiSecret: string) => {
  mailjet = new Client({
    apiKey,
    apiSecret,
  });
};

/**
 * Send an email using Mailjet.
 * @param mailjet A Mailjet client.
 * @param data Data to be sent in the email.
 * @param template A mustache template for the email.
 * @returns
 */
export const sendEmail = <T>(
  data: EmailData<T>,
  template: EmailTemplate<T>,
) => {
  if (!mailjet)
    throw new Error("sendEmail called before mailer was initialized.");

  console.log("data", data);

  const body: SendEmailV3_1.Body = {
    Messages: [
      {
        From: data.from,
        To: data.to,
        Subject: data.subject,
        TextPart: mustache.render(template.text, data.payload),
        HTMLPart: mustache.render(template.html, data.payload),
        CustomID: "BasicEmail",
      },
    ],
  };

  return mailjet.post("send", { version: "v3.1" }).request(body);
};
