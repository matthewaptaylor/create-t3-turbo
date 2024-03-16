import type { FC } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { useTranslation } from "@acme/client-translations";

import { EmailPasswordResetPassword } from "~/components/auth/EmailPasswordResetPassword";
import { useTitle } from "~/lib/hooks";

const CreateAccount: FC = () => {
  const { t } = useTranslation();
  useTitle(t("Reset your password"));

  return (
    <>
      <h1 className="text-center text-3xl font-bold">
        {t("Reset your password")}
      </h1>

      <div className="space-y-4">
        <EmailPasswordResetPassword />
      </div>
    </>
  );
};

export const Route = createFileRoute("/_auth-layout/auth/reset-password")({
  component: CreateAccount,
});
