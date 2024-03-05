import type { FC } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { useTranslation } from "@acme/translations";

import { EmailPasswordResetPassword } from "~/components/auth/EmailPasswordResetPassword";
import { useTitle } from "~/lib/hooks";

const CreateAccount: FC = () => {
  const { t } = useTranslation();
  useTitle(t("Create an account"));

  const { redirect } = Route.useSearch();

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t("Reset your password")}</h1>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <EmailPasswordResetPassword redirect={redirect} />
      </div>
    </>
  );
};

const createAccountSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/_auth-layout/auth/reset-password")({
  component: CreateAccount,
  validateSearch: (search) => createAccountSearchSchema.parse(search),
});
