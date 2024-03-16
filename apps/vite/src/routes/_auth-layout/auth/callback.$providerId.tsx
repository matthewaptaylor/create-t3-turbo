import type { FC } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { useTranslation } from "@acme/client-translations";

import { ThirdPartyCallback } from "~/components/auth/ThirdPartyCallback";
import { useTitle } from "~/lib/hooks";

const CallbackGoogle: FC = () => {
  const { t } = useTranslation();
  useTitle(t("Sign in"));

  return (
    <>
      <h1 className="text-center text-3xl font-bold">{t("Sign in")}</h1>

      <ThirdPartyCallback />
    </>
  );
};

export const Route = createFileRoute("/_auth-layout/auth/callback/$providerId")(
  {
    component: CallbackGoogle,
  },
);
