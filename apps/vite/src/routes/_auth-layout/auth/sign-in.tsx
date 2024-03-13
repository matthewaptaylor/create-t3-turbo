import type { FC } from "react";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import { useTranslation } from "@acme/translations";

import { EmailPasswordSignIn } from "~/components/auth/EmailPasswordSignIn";
import { ThirdPartySignIn } from "~/components/auth/ThirdPartySignIn";
import { Separator } from "~/components/ui/separator";
import { useTitle } from "~/lib/hooks";
import { useSignInWithGoogleUrlQuery } from "~/lib/queries";
import { redirectIfAuthenticated } from "~/lib/router";

const SignIn: FC = () => {
  const { t } = useTranslation();
  useTitle(t("Sign in"));

  const { redirect } = Route.useSearch();

  return (
    <>
      <h1 className="text-center text-3xl font-bold">{t("Sign in")}</h1>

      <div className="space-y-4">
        <EmailPasswordSignIn redirect={redirect} />

        <div className="text-end text-sm">
          {t("Don't have an account?")}{" "}
          <Link to="/auth/create-account" className="underline">
            {t("Create account")}
          </Link>
        </div>

        <Separator />

        <ThirdPartySignIn
          linkQuery={useSignInWithGoogleUrlQuery(redirect)}
          icon={faGoogle}
          text={t("Sign in with Google")}
          errorText={t(
            "We couldn't sign you in with Google. Please try again later.",
          )}
        />
      </div>
    </>
  );
};

const signInSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/_auth-layout/auth/sign-in")({
  component: SignIn,
  validateSearch: (search) => signInSearchSchema.parse(search),
  beforeLoad: async () => {
    await redirectIfAuthenticated();
  },
});
