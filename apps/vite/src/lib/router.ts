import { lazy } from "react";
import { createRouter, redirect } from "@tanstack/react-router";
import Session from "supertokens-web-js/recipe/session";

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

/**
 * Redirect to sign in if the session does not exist.
 */
export const redirectIfUnauthenticated = async (currentHref: string) => {
  if (!(await Session.doesSessionExist())) {
    throw redirect({
      to: "/auth/sign-in",
      search: {
        redirect: currentHref,
      },
    });
  }
};

/**
 * Redirect to dashboard if the session exists.
 */
export const redirectIfAuthenticated = async () => {
  if (await Session.doesSessionExist()) {
    throw redirect({
      to: "/dashboard",
    });
  }
};
