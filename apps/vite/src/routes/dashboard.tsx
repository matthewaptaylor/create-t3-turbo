import { createFileRoute } from "@tanstack/react-router";

import { redirectIfUnauthenticated } from "~/lib/router";

export const Route = createFileRoute("/dashboard")({
  component: () => <div>Hello /dashboard!</div>,
  beforeLoad: async ({ location }) => {
    await redirectIfUnauthenticated(location.href);
  },
});
