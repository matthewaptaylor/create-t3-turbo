import type { FC } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import { useTranslation } from "@acme/translations";

import { EmailPasswordCreateAccount } from "~/components/auth/EmailPasswordCreateAccount";
import { useTitle } from "~/lib/hooks";
import { redirectIfAuthenticated } from "~/lib/router";

const CreateAccount: FC = () => {
  const { t } = useTranslation();
  useTitle(t("Create an account"));

  const { redirect } = Route.useSearch();

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t("Create an account")}</h1>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <EmailPasswordCreateAccount redirect={redirect} />

        <div className="w-full max-w-sm text-end text-sm">
          {t("Already have an account?")}{" "}
          <Link to="/auth/sign-in" className="underline">
            {t("Sign in")}
          </Link>
        </div>
      </div>
    </>
  );
};

const createAccountSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/_auth-layout/auth/create-account")({
  component: CreateAccount,
  validateSearch: (search) => createAccountSearchSchema.parse(search),
  beforeLoad: async () => {
    await redirectIfAuthenticated();
  },
});
