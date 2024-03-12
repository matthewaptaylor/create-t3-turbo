# @acme/mailer

This package handles sending templated emails.

## Usage

1. First you must initialise the mailer before calling using it.

```ts
import { initMailer } from "@acme/mailer";

initMailer(env.MAILJET_API_KEY, env.MAILJET_API_SECRET);
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
