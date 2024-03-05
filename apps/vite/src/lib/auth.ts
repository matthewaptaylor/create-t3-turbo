import SuperTokens from "supertokens-web-js";
import EmailPassword from "supertokens-web-js/recipe/emailpassword";
import Session from "supertokens-web-js/recipe/session";
import ThirdPartyEmailPassword from "supertokens-web-js/recipe/thirdpartyemailpassword";

import { env } from "~/env";

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
      EmailPassword.init(),
      ThirdPartyEmailPassword.init(),
    ],
  });
};
