import type { FC } from "react";

import { useTranslation } from "@acme/client-translations";

const NotFound: FC = () => {
  const { t } = useTranslation();

  return <div>{t("Not found")}</div>;
};

export default NotFound;
