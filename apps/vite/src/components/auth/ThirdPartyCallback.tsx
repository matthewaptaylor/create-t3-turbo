import type { FC } from "react";
import { useEffect } from "react";
import {
  faArrowsRotate,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "@tanstack/react-router";

import { useTranslation } from "@acme/translations";

import { useThirdPartySignInUpMutation } from "~/lib/mutations";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export interface ThirdPartyCallbackProps {
  redirect?: string;
}

export const ThirdPartyCallback: FC<ThirdPartyCallbackProps> = () => {
  const { t } = useTranslation();

  const { mutate, ...mutation } = useThirdPartySignInUpMutation();

  const navigate = useNavigate();

  // Run callback on mount
  useEffect(() => {
    mutate();
  }, [mutate]);

  // Redirect to dashboard on success
  useEffect(() => {
    if (mutation.isSuccess && mutation.data.status === "OK")
      void navigate({
        to: "/dashboard",
        replace: true,
      });
  }, [mutation, navigate]);

  const mutationError = mutation.isError
    ? t("An error occurred. Please try again later.")
    : null;

  const notAllowedError =
    mutation.data?.status === "SIGN_IN_UP_NOT_ALLOWED" ? (
      <>
        {t("You cannot sign in with this account.")}{" "}
        <Link to="/auth/sign-in">{t("Please try another method.")}</Link>
      </>
    ) : null;

  const noEmailError =
    mutation.data?.status === "NO_EMAIL_GIVEN_BY_PROVIDER" ? (
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
