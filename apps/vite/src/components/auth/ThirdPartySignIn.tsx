import type { IconDefinition } from "@fortawesome/free-brands-svg-icons";
import type { UseQueryResult } from "@tanstack/react-query";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  faArrowsRotate,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useTranslation } from "@acme/translations";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";

export interface ThirdPartySignInProps {
  /**
   * The query to get the URL to redirect to.
   */
  useUrlQuery: () => UseQueryResult<string, Error>;

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
  useUrlQuery,
  icon,
  text,
  errorText,
}) => {
  const { t } = useTranslation();

  const link = useUrlQuery();
  const [linkClicked, setLinkClicked] = useState(false);

  useEffect(() => {
    if (link.data && linkClicked) window.location.href = link.data;
  }, [link.data, linkClicked]);

  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        variant="outline"
        onClick={() => {
          setLinkClicked(true);

          if (link.isError) void link.refetch();
        }}
      >
        {link.isPending && linkClicked ? (
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

      {link.isError && linkClicked && (
        <Alert variant="destructive">
          <FontAwesomeIcon icon={faExclamationTriangle} />

          <AlertTitle>{t("Oops!")}</AlertTitle>
          <AlertDescription>{errorText}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
