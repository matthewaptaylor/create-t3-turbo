import type { IconDefinition } from "@fortawesome/free-brands-svg-icons";
import type { UseQueryResult } from "@tanstack/react-query";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  faArrowsRotate,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useTranslation } from "@acme/client-translations";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";

export interface ThirdPartySignInProps {
  /**
   * The query result to get the URL to redirect to.
   */
  linkQuery: UseQueryResult<string, Error>;

  /**
   * The icon to display next to the button text.
   */
  icon: IconDefinition;

  /**
   * The button text.
   */
  text: string;

  /**
   * The error text to display if the url could not be retrieved.
   */
  errorText: string;
}

/**
 * A button to redirect to a third-party sign-in page.
 * @param props
 * @returns
 */
export const ThirdPartySignIn: FC<ThirdPartySignInProps> = ({
  linkQuery,
  icon,
  text,
  errorText,
}) => {
  const { t } = useTranslation();

  const [linkClicked, setLinkClicked] = useState(false);

  useEffect(() => {
    if (linkQuery.data && linkClicked) window.location.href = linkQuery.data;
  }, [linkQuery.data, linkClicked]);

  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        variant="outline"
        onClick={() => {
          setLinkClicked(true);

          if (linkQuery.isError) void linkQuery.refetch();
        }}
      >
        {linkQuery.isPending && linkClicked ? (
          <FontAwesomeIcon
            icon={faArrowsRotate}
            role="status"
            aria-label={t("Loading...")}
            className="me-2 animate-spin"
          />
        ) : (
          <FontAwesomeIcon icon={icon} aria-hidden className="me-2" />
        )}
        {text}
      </Button>

      {linkQuery.isError && linkClicked && (
        <Alert variant="destructive">
          <FontAwesomeIcon icon={faExclamationTriangle} />

          <AlertTitle>{t("Oops!")}</AlertTitle>
          <AlertDescription>{errorText}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
