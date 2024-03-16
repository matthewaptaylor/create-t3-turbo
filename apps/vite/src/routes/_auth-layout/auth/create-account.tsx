import type { FC } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import { useTranslation } from "@acme/client-translations";

import { EmailPasswordCreateAccount } from "~/components/auth/EmailPasswordCreateAccount";
import { useTitle } from "~/lib/hooks";
import { redirectIfAuthenticated } from "~/lib/router";

const CreateAccount: FC = () => {
  const { t } = useTranslation();
  useTitle(t("Create an account"));

  const { redirect } = Route.useSearch();

  return (
    <>
      <h1 className="text-center text-3xl font-bold">
        {t("Create an account")}
      </h1>

      <div className="space-y-4">
        <EmailPasswordCreateAccount redirect={redirect} />

        <div className="text-end text-sm">
          {t("Already have an account?")}{" "}
          <Link
            to="/auth/sign-in"
            search={{
              redirect,
            }}
            className="underline"
          >
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
