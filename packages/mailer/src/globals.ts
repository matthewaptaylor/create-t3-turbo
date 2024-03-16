import { Client } from "node-mailjet";

import type { I18n } from "@acme/server-translations";

export let mailjet: Client;
export let i18n: I18n;

/**
 * Create a new Mailjet client.
 * @param apiKey
 * @param apiSecret
 * @returns
 */
export const initMailer = (
  apiKey: string,
  apiSecret: string,
  externalI18n: I18n,
) => {
  mailjet = new Client({
    apiKey,
    apiSecret,
  });
  i18n = externalI18n;
};
