# @acme/translations

Translations for use across front-ends. This re-exports an initialised instance of the `react-i18next` library, and provides a hook for use in components.

## Usage

Set up the translations in your application's entry point:

```tsx
import { setupI18n } from "@acme/translations";

setupI18n().catch(console.error);
```

Then use the `useTranslation` hook in your components:

```tsx
import { FC } from "react";

import { useTranslation } from "@acme/translations";

const MyComponent: FC = () => {
  const { t } = useTranslation();

  return <div>{t("my.translation.key")}</div>;
};
```
