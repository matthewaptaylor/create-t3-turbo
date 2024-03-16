import type { FC } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { useTranslation } from "@acme/translations";

import { Button } from "~/components/ui/button";
import {
  redirectIfEmailNotVerified,
  redirectIfNotAuthenticated,
} from "~/lib/router";

const Dashboard: FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>Dashboard</h1>
      <Button asChild>
        <Link to="/auth/sign-out">{t("Sign out")}</Link>
      </Button>
    </div>
  );
};

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  beforeLoad: async ({ location }) => {
    await redirectIfNotAuthenticated(location.href);
    await redirectIfEmailNotVerified(location.href);
  },
});
