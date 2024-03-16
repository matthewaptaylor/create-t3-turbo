import type { FC } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { useTranslation } from "@acme/client-translations";

import { SendVerificationEmail } from "~/components/auth/SendVerificationEmail";
import { useTitle } from "~/lib/hooks";
import {
  redirectIfEmailVerified,
  redirectIfNotAuthenticated,
} from "~/lib/router";

const UnverifiedEmail: FC = () => {
  const { t } = useTranslation();
  useTitle(t("Verify your email"));

  return (
    <>
      <h1 className="text-center text-3xl font-bold">
        {t("Verify your email")}
      </h1>

      <SendVerificationEmail />
    </>
  );
};

export const Route = createFileRoute("/_auth-layout/auth/unverified-email")({
  component: UnverifiedEmail,
  beforeLoad: async ({ location }) => {
    await redirectIfNotAuthenticated(location.href);
    await redirectIfEmailVerified();
  },
});
