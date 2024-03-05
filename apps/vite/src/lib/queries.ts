import { useQuery } from "@tanstack/react-query";
import { getAuthorisationURLWithQueryParamsAndSetState } from "supertokens-web-js/recipe/thirdpartyemailpassword";

export enum Queries {
  SIGN_IN_WITH_GOOGLE_URL,
  DOES_EMAIL_EXIST,
}

/**
 * Query hook to get the URL to sign in with Google.
 * @returns
 */
export const useSignInWithGoogleUrlQuery = () =>
  useQuery({
    queryKey: [Queries.SIGN_IN_WITH_GOOGLE_URL],
    queryFn: () =>
      getAuthorisationURLWithQueryParamsAndSetState({
        thirdPartyId: "google",
        frontendRedirectURI: `${window.location.origin}/auth/callback/google`,
      }),
  });
