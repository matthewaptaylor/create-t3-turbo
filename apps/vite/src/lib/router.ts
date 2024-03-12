import { lazy } from "react";
import { createRouter, redirect } from "@tanstack/react-router";
import { EmailVerificationClaim } from "supertokens-web-js/recipe/emailverification";
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
 * @param currentHref The current href to redirect to after signing in.
 */
export const redirectIfNotAuthenticated = async (currentHref: string) => {
  if (!(await Session.doesSessionExist()))
    throw redirect({
      to: "/auth/sign-in",
      search: {
        redirect: currentHref,
      },
    });
};

/**
 * Redirect to dashboard if the session exists.
 */
export const redirectIfAuthenticated = async () => {
  if (await Session.doesSessionExist())
    throw redirect({
      to: "/dashboard",
    });
};

/**
 * Redirect to unverified email if the email is not verified. Does nothing if
 * the session does not exist.
 * @param currentHref The current href to redirect to after verifying the email.
 */
export const redirectIfEmailNotVerified = async (currentHref: string) => {
  if (await Session.doesSessionExist()) {
    const validationErrors = await Session.validateClaims();

    if (
      validationErrors.some(
        (err) => err.validatorId === EmailVerificationClaim.id,
      )
    )
      throw redirect({
        // TODO: Fix this redirect
        to: "/auth/unverified-email",
        search: {
          redirect: currentHref,
        },
      });
  }
};

/**
 * Redirect to dashboard if the email is verified. Does nothing if the session
 * does not exist.
 */
export const redirectIfEmailVerified = async () => {
  if (await Session.doesSessionExist()) {
    const validationErrors = await Session.validateClaims();

    if (
      !validationErrors.some(
        (err) => err.validatorId === EmailVerificationClaim.id,
      )
    )
      throw redirect({
        to: "/dashboard",
      });
  }
};
