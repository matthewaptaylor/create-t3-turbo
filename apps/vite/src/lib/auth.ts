import SuperTokens from "supertokens-web-js";
import EmailVerification from "supertokens-web-js/recipe/emailverification";
import Session from "supertokens-web-js/recipe/session";
import ThirdPartyEmailPassword from "supertokens-web-js/recipe/thirdpartyemailpassword";

import { env } from "~/env";
import { decodeBase64Json, encodeBase64Json, isRecord } from "~/lib/utils";

export const AUTH_ENDPOINT = "/auth"; // Same as apps/server/src/endpoints/auth.ts

export const setupAuth = () => {
  SuperTokens.init({
    appInfo: {
      apiDomain: env.VITE_API_URI,
      apiBasePath: AUTH_ENDPOINT,
      appName: env.VITE_APP_NAME,
    },
    recipeList: [
      Session.init(),
      EmailVerification.init(),
      ThirdPartyEmailPassword.init({
        override: {
          functions: (originalImplementation) => ({
            ...originalImplementation,
            generateStateToSendToOAuthProvider: (input) => {
              // Add the redirect URL to the state
              const response =
                originalImplementation.generateStateToSendToOAuthProvider(
                  input,
                );

              const newPayload = {
                ...decodeBase64Json(response),
                redirect: isRecord(input?.userContext)
                  ? input.userContext.redirect
                  : undefined,
              };

              return encodeBase64Json(newPayload);
            },
          }),
        },
      }),
    ],
  });
};
