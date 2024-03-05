import type { FastifyInstance } from "fastify";
import formDataPlugin from "@fastify/formbody";
import supertokens from "supertokens-node";
import {
  errorHandler as supertokensFastifyErrorHandler,
  plugin as supertokensFastifyPlugin,
} from "supertokens-node/framework/fastify";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import ThirdParty from "supertokens-node/recipe/thirdparty";

import { validatePassword } from "@acme/validators";

import { env } from "../env";

export const AUTH_ENDPOINT = "/auth"; // Same as apps/vite/src/lib/auth.ts

const WEBSITE_AUTH_PATH = "/auth";

export const getAuthCorsHeaders = supertokens.getAllCORSHeaders;

/**
 * Catch all errors from SuperTokens in Fastify. This should be run before
 * routes and plugin registration.
 * @param server The Fastify server instance.
 */
export const setupFastifyAuthErrorHandler = (server: FastifyInstance) => {
  server.setErrorHandler(supertokensFastifyErrorHandler());
};

/**
 * Setup the Fastify server with SuperTokens Auth.
 * @param server The Fastify server instance.
 */
export const setupFastifyAuth = async (server: FastifyInstance) => {
  // Initialize SuperTokens
  supertokens.init({
    framework: "fastify",
    supertokens: {
      connectionURI: env.SUPERTOKENS_CONNECTION_URI,
      apiKey: env.SUPERTOKENS_API_KEY,
    },
    appInfo: {
      appName: env.SUPERTOKENS_APP_NAME,
      apiDomain: env.API_URI,
      websiteDomain: env.WEBSITE_URI,
      apiBasePath: AUTH_ENDPOINT,
      websiteBasePath: WEBSITE_AUTH_PATH,
    },
    recipeList: [
      Session.init(),
      EmailPassword.init({
        signUpFeature: {
          formFields: [
            {
              id: "password",
              validate: async (value) => {
                const validated = await validatePassword.safeParseAsync(value);
                return validated.success ? undefined : validated.error.message;
              },
            },
          ],
        },
      }), // initializes signin / sign up features
      ThirdParty.init({
        signInAndUpFeature: {
          providers: [
            {
              config: {
                thirdPartyId: "google",
                clients: [
                  {
                    clientId: env.GOOGLE_CLIENT_ID,
                    clientSecret: env.GOOGLE_CLIENT_SECRET,
                  },
                ],
              },
            },
          ],
        },
      }),
    ],
  });

  await server.register(formDataPlugin);
  await server.register(supertokensFastifyPlugin);
};
