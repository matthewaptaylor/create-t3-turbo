import { lazy } from "react";
import { createRouter } from "@tanstack/react-router";

import { routeTree } from "~/routeTree.gen";

export const router = createRouter({ routeTree });

export const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : lazy(() =>
      // Lazy load in development
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    );
