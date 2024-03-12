import type { FC } from "react";
import { useEffect } from "react";
import {
  faArrowsRotate,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useTranslation } from "@acme/translations";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { useTitle } from "~/lib/hooks";
import { useSignOutMutation } from "~/lib/mutations";

const SignOut: FC = () => {
  const { t } = useTranslation();
  useTitle(t("Sign out"));

  const navigate = useNavigate();

  const mutation = useSignOutMutation();

  // Sign out on mount
  useEffect(() => {
    mutation.mutate();
  }, [mutation]);

  // Redirect to home on success
  useEffect(() => {
    if (mutation.isSuccess)
      void navigate({
        to: "/",
        replace: true,
      });
  }, [mutation.isSuccess, navigate]);

  return mutation.isError ? (
    <Alert variant="destructive">
      <FontAwesomeIcon icon={faExclamationTriangle} />

      <AlertTitle>{t("Oops!")}</AlertTitle>
      <AlertDescription>
        {t("An error occurred while signing out. Please try again later.")}
      </AlertDescription>
    </Alert>
  ) : (
    <FontAwesomeIcon
      icon={faArrowsRotate}
      role="status"
      aria-label={t("Signing out...")}
      className="me-2 animate-spin"
    />
  );
};

export const Route = createFileRoute("/_auth-layout/auth/sign-out")({
  component: SignOut,
});
