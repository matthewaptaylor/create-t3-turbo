import type { FC } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { useTranslation } from "@acme/translations";

import { VerifyEmail } from "~/components/auth/VerifyEmail";
import { useTitle } from "~/lib/hooks";

const UnverifiedEmail: FC = () => {
  const { t } = useTranslation();
  useTitle(t("Verify your email"));

  return (
    <>
      <h1 className="text-center text-3xl font-bold">
        {t("Verify your email")}
      </h1>

      <VerifyEmail />
    </>
  );
};

export const Route = createFileRoute("/_auth-layout/auth/verify-email")({
  component: UnverifiedEmail,
});
