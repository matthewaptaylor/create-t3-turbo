# @acme/mailer

This package handles sending templated emails.

## Usage

1. First you must initialise the mailer before calling using it.

```ts
import { i18n, setupI18n } from "@acme/client-translations";
import { initMailer } from "@acme/mailer";

await setupI18n();
initMailer(env.MAILJET_API_KEY, env.MAILJET_API_SECRET, i18n);
```

2. Then you may send an email with a template.

```ts
import { basicEmailTemplate, sendEmail } from "@acme/mailer";

await sendEmail(
  {
    from: {
      Email: ...,
      Name: ...,
    },
    to: [
      {
        Email: ...,
      },
    ],
    subject: ...,
    payload: {
      ...
    },
  },
  basicEmailTemplate,
);
```

## Writing emails

To write an email, you should create a `.mjml.hbs` and `.txt.hbs` file in the `templates` directory. The `.mjml.hbs` file is the HTML version of the email, and the `.txt.hbs` file is the plain text version of the email. You can then export a template like so:

```ts
export const verifyEmailTemplate: EmailTemplate<VerifyEmailPayload> = {
  text: createTemplate(importText("verify.txt.hbs"), ["companyName"]),
  html: createTemplate(importMjml("verify.mjml.hbs"), ["companyName"]),
};
```

By adding the `companyName` key, the translation `companyName` from the email namespace in `@acme/client-translations` can be accessed in the template using

```hbs
The company name is {{t.companyName}}.
```
