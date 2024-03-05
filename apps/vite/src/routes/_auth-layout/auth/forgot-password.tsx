import type { FC } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import { useTranslation } from "@acme/translations";

import { EmailPasswordForgotPassword } from "~/components/auth/EmailPasswordForgotPassword";
import { useTitle } from "~/lib/hooks";

const SignIn: FC = () => {
  const { t } = useTranslation();
  useTitle(t("Forgot your password?"));

  const { redirect } = Route.useSearch();

  return (
    <>
      <h1 className="text-center text-3xl font-bold">
        {t("Forgot your password?")}
      </h1>

      <div className="space-y-4">
        <EmailPasswordForgotPassword redirect={redirect} />

        <div className="text-end text-sm">
          {t("Know your password?")}{" "}
          <Link to="/auth/sign-in" className="underline">
            {t("Sign in")}
          </Link>
        </div>
      </div>
    </>
  );
};

const signInSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/_auth-layout/auth/forgot-password")({
  component: SignIn,
  validateSearch: (search) => signInSearchSchema.parse(search),
});
