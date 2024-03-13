import type { FC } from "react";
import {
  faArrowsRotate,
  faCheck,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useTranslation } from "@acme/translations";

import { Button } from "~/components/ui/button";
import { useSendVerificationEmailMutation } from "~/lib/mutations";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const SendVerificationEmail: FC = () => {
  const { t } = useTranslation();

  const mutation = useSendVerificationEmailMutation();

  const mutationError = mutation.isError
    ? t("An error occurred. Please try again later.") // Field validation should be handled by the form
    : null;

  const alreadyVerifiedError =
    mutation.data?.status === "EMAIL_ALREADY_VERIFIED_ERROR"
      ? t("Your email is already verified.")
      : null;

  const error = mutationError ?? alreadyVerifiedError;

  return (
    <div className="space-y-4">
      <p>
        {t(
          "An email has been sent to you. Click the link in the email to verify your email address.",
        )}
      </p>

      {mutation.data?.status === "OK" && (
        <Alert variant="default">
          <FontAwesomeIcon icon={faCheck} />

          <AlertTitle>{t("Success!")}</AlertTitle>
          <AlertDescription>
            {t("Another verification email has been sent.")}
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

      <Button
        className="w-full"
        onClick={() => {
          mutation.mutate();
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

        {t("Send another verification email")}
      </Button>
    </div>
  );
};
