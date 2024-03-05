import type { FC } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";
import { redirectIfUnauthenticated } from "~/lib/router";

const Dashboard: FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Button asChild>
        <Link to="/auth/sign-out">Sign out</Link>
      </Button>
    </div>
  );
};

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  beforeLoad: async ({ location }) => {
    await redirectIfUnauthenticated(location.href);
  },
});
