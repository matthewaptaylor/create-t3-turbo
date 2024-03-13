import type { FastifyInstance } from "fastify";
import formDataPlugin from "@fastify/formbody";
import supertokens from "supertokens-node";
import {
  errorHandler as supertokensFastifyErrorHandler,
  plugin as supertokensFastifyPlugin,
} from "supertokens-node/framework/fastify";
import EmailVerification from "supertokens-node/recipe/emailverification";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

import { basicEmailTemplate, sendEmail } from "@acme/mailer";
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
      EmailVerification.init({
        mode: "OPTIONAL",
        emailDelivery: {
          override: (originalImplementation) => {
            return {
              ...originalImplementation,
              sendEmail: async function (input) {
                // Send an email verification email using Mailjet
                await sendEmail(
                  {
                    from: {
                      Email: "matthewaptaylor@gmail.com",
                      Name: "Matthew",
                    },
                    to: [
                      {
                        Email: input.user.email,
                      },
                    ],
                    subject: "Verify your email",
                    payload: {
                      title: "Verify your email",
                      preview:
                        "Please verify your email address using this link.",
                      greeting: "Hello!",
                      beforeButton:
                        "Please verify your email address using the button below.",
                      buttonText: "Verify email",
                      buttonLink: input.emailVerifyLink,
                      afterButton:
                        "If you did not sign up for an account, you can ignore this email.",
                      goodbye: "Thanks!",
                      address: "Acme Inc.",
                    },
                  },
                  basicEmailTemplate,
                );
              },
            };
          },
        },
      }),
      ThirdPartyEmailPassword.init({
        signUpFeature: {
          formFields: [
            // Custom password validation
            {
              id: "password",
              validate: async (value) => {
                const validated = await validatePassword.safeParseAsync(value);
                return validated.success ? undefined : validated.error.message;
              },
            },
          ],
        },
        providers: [
          // Google OAuth
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
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,

              // Override the email password sign up function
              emailPasswordSignUp: async function (input) {
                const response =
                  await originalImplementation.emailPasswordSignUp(input);

                if (
                  response.status === "OK" &&
                  response.user.loginMethods.length === 1
                ) {
                  // Sign up completed
                }

                return response;
              },

              // Override the email password sign in function
              emailPasswordSignIn: async function (input) {
                const response =
                  await originalImplementation.emailPasswordSignIn(input);

                if (response.status === "OK") {
                  // Sign in completed
                }

                return response;
              },

              // Override the third party sign in/up function
              thirdPartySignInUp: async function (input) {
                const response =
                  await originalImplementation.thirdPartySignInUp(input);

                if (response.status === "OK") {
                  // Sign in/up completed

                  // const firstName =
                  //   response.rawUserInfoFromProvider.fromUserInfoAPI!
                  //     .first_name;

                  console.log(JSON.stringify(response));

                  if (
                    response.createdNewRecipeUser &&
                    response.user.loginMethods.length === 1
                  ) {
                    // New user signed up
                  } else {
                    // Existing user signed in
                  }
                }

                return response;
              },
            };
          },
        },
      }),
    ],
  });

  await server.register(formDataPlugin);
  await server.register(supertokensFastifyPlugin);
};
