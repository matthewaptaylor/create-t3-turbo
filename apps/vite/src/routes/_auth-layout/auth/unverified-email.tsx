import type { FC } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { useTranslation } from "@acme/translations";

import { SendVerificationEmail } from "~/components/auth/SendVerificationEmail";
import { useTitle } from "~/lib/hooks";
import {
  redirectIfEmailVerified,
  redirectIfNotAuthenticated,
} from "~/lib/router";

const UnverifiedEmail: FC = () => {
  const { t } = useTranslation();
  useTitle(t("Verify your email"));

  const { redirect } = Route.useSearch();

  return (
    <>
      <h1 className="text-center text-3xl font-bold">
        {t("Verify your email")}
      </h1>

      <SendVerificationEmail redirect={redirect} />
    </>
  );
};

const unverifiedEmailSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/_auth-layout/auth/unverified-email")({
  component: UnverifiedEmail,
  validateSearch: (search) => unverifiedEmailSearchSchema.parse(search),
  beforeLoad: async ({ location }) => {
    await redirectIfNotAuthenticated(location.href);
    await redirectIfEmailVerified();
  },
});
