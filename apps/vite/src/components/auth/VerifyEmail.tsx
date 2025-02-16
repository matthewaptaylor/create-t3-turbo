import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  faArrowsRotate,
  faCheck,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import Session from "supertokens-web-js/recipe/session";

import { useTranslation } from "@acme/client-translations";

import { Button } from "~/components/ui/button";
import { useVerifyEmailMutation } from "~/lib/mutations";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const VerifyEmail: FC = () => {
  const { t } = useTranslation();

  const { mutate, ...mutation } = useVerifyEmailMutation();

  // Automatically process the verification if the user is already logged in
  const [automatic, setAutomatic] = useState<boolean | null>(null);
  useEffect(() => {
    if (automatic !== null) return;

    Session.doesSessionExist()
      .then((exists) => {
        setAutomatic(exists);

        if (exists) mutate();
      })
      .catch(() => setAutomatic(false));
  }, [mutate, automatic]);

  const mutationError = mutation.isError
    ? t("An error occurred. Please try again later.") // Field validation should be handled by the form
    : null;

  const invalidTokenError =
    mutation.data?.status === "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR" ? (
      <>
        {t("Your email verification link has expired.")}{" "}
        <Link to="/auth/unverified-email" className="underline">
          {t("Send another email.")}
        </Link>
      </>
    ) : null;

  const error = mutationError ?? invalidTokenError;

  return (
    <div className="space-y-4">
      {automatic === false && (
        <p>{t("Click the button below to verify your email address.")}</p>
      )}

      {automatic === true && mutation.isPending && (
        <div className="text-center">
          <FontAwesomeIcon
            icon={faArrowsRotate}
            role="status"
            aria-label={t("Loading...")}
            className="animate-spin"
          />
        </div>
      )}

      {mutation.data?.status === "OK" && (
        <Alert variant="default">
          <FontAwesomeIcon icon={faCheck} />

          <AlertTitle>{t("Success!")}</AlertTitle>
          <AlertDescription>
            {t("Your email has been verified.")}{" "}
            <Link to="/dashboard" className="underline">
              {t("Go to dashboard.")}
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <FontAwesomeIcon icon={faExclamationTriangle} />

          <AlertTitle>{t("Oops!")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {automatic === false && (
        <Button
          className="w-full"
          onClick={() => {
            mutate();
          }}
        >
          {mutation.isPending && (
            <FontAwesomeIcon
              icon={faArrowsRotate}
              role="status"
              aria-label={t("Loading...")}
              className="me-2 animate-spin"
            />
          )}

          {t("Verify email")}
        </Button>
      )}
    </div>
  );
};
