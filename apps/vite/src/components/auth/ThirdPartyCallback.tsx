import type { FC } from "react";
import { useEffect } from "react";
import {
  faArrowsRotate,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "@tanstack/react-router";
import { getStateAndOtherInfoFromStorage } from "supertokens-web-js/recipe/thirdpartyemailpassword";

import { useTranslation } from "@acme/client-translations";

import { useThirdPartySignInUpQuery } from "~/lib/queries";
import { router } from "~/lib/router";
import { decodeBase64Json } from "~/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export interface ThirdPartyCallbackProps {
  redirect?: string;
}

export const ThirdPartyCallback: FC<ThirdPartyCallbackProps> = () => {
  const { t } = useTranslation();

  const query = useThirdPartySignInUpQuery();

  const navigate = useNavigate();

  // Redirect to dashboard on success
  useEffect(() => {
    if (query.isSuccess && query.data.status === "OK") {
      // Get the redirect URL, if any from the state
      const state = getStateAndOtherInfoFromStorage()?.stateForAuthProvider;
      const redirect = decodeBase64Json(state).redirect;
      if (typeof redirect === "string") return router.history.push(redirect);

      // Otherwise, navigate to the dashboard
      void navigate({
        to: "/dashboard",
        replace: true,
      });
    }
  }, [query, navigate]);

  const mutationError = query.isError
    ? t("An error occurred. Please try again later.")
    : null;

  const notAllowedError =
    query.data?.status === "SIGN_IN_UP_NOT_ALLOWED" ? (
      <>
        {t("You cannot sign in with this account.")}{" "}
        <Link to="/auth/sign-in">{t("Please try another method.")}</Link>
      </>
    ) : null;

  const noEmailError =
    query.data?.status === "NO_EMAIL_GIVEN_BY_PROVIDER" ? (
      <>
        {t("No email address is associated with this account.")}{" "}
        <Link to="/auth/sign-in">{t("Please try another method.")}</Link>
      </>
    ) : null;

  const error = mutationError ?? notAllowedError ?? noEmailError;

  return error ? (
    <Alert variant="destructive">
      <FontAwesomeIcon icon={faExclamationTriangle} />

      <AlertTitle>{t("Oops!")}</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  ) : (
    <FontAwesomeIcon
      icon={faArrowsRotate}
      role="status"
      aria-label={t("Signing in...")}
      className="me-2 animate-spin"
    />
  );
};
