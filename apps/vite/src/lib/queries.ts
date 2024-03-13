import { useQuery } from "@tanstack/react-query";
import {
  getAuthorisationURLWithQueryParamsAndSetState,
  thirdPartySignInAndUp,
} from "supertokens-web-js/recipe/thirdpartyemailpassword";

export enum Queries {
  SIGN_IN_WITH_GOOGLE_URL,
  THIRD_PARTY_SIGN_IN_UP,
}

/**
 * Query hook to get the URL to sign in with Google.
 * @param redirect The URL to redirect to after a successful sign in.
 * @returns
 */
export const useSignInWithGoogleUrlQuery = (redirect?: string) =>
  useQuery({
    queryKey: [Queries.SIGN_IN_WITH_GOOGLE_URL],
    queryFn: () =>
      getAuthorisationURLWithQueryParamsAndSetState({
        thirdPartyId: "google",
        frontendRedirectURI: `${window.location.origin}/auth/callback/google`,
        userContext: {
          redirect,
        },
      }),
  });

/**
 * Query hook to fetch a session after signing in or signing up with a
 * third-party provider.
 * @returns
 */
export const useThirdPartySignInUpQuery = () =>
  useQuery({
    queryKey: [Queries.THIRD_PARTY_SIGN_IN_UP],
    queryFn: () => thirdPartySignInAndUp(),
  });
