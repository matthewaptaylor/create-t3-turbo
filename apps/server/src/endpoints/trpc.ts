import type {
  CreateFastifyContextOptions,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import supertokens, { Error as SuperTokensError } from "supertokens-node";
import { EmailVerificationClaim } from "supertokens-node/recipe/emailverification";
import SuperTokensSession from "supertokens-node/recipe/session";

import type { AppRouter, Session, TRPCContext } from "@acme/api";
import { appRouter, SessionErrorEnum } from "@acme/api";

export const TRPC_ENDPOINT = "/trpc";

export const prisma = new PrismaClient();

/**
 * This helper generates the "internals" for a tRPC context. The API handler
 * will wrap this and provides the required context.
 * @param opts The options for creating the context.
 * @returns The context.
 */
const createTRPCContext = async ({
  req,
  res,
}: CreateFastifyContextOptions): Promise<TRPCContext> => {
  try {
    // Get the user session
    const sessionContainer = await SuperTokensSession.getSession(req, res);

    // Get the user's email verification claim
    const payload: unknown = sessionContainer.getAccessTokenPayload();
    const emailValidation = await EmailVerificationClaim.validators
      .isVerified()
      .validate(payload, {});

    const session: Session = {
      userId: sessionContainer.getUserId(),
      recipeUserId: sessionContainer.getRecipeUserId().getAsString(),
      emailVerified: emailValidation.isValid,
    };

    // Return the authorised session
    return {
      session,
      sessionError: null,
      prisma,
      supertokens,
    };
  } catch (e) {
    let sessionError: SessionErrorEnum;

    if (SuperTokensError.isErrorFromSuperTokens(e)) {
      // User is not authorised
      switch (e.type) {
        case SuperTokensSession.Error.UNAUTHORISED:
          sessionError = SessionErrorEnum.UNAUTHORISED;
          break;
        case SuperTokensSession.Error.TRY_REFRESH_TOKEN:
          sessionError = SessionErrorEnum.TRY_REFRESH_TOKEN;
          break;
        case SuperTokensSession.Error.INVALID_CLAIMS:
          sessionError = SessionErrorEnum.INVALID_CLAIMS;
          break;
        default:
          sessionError = SessionErrorEnum.OTHER;
          break;
      }
    } else {
      // An unexpected error occurred
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }

    // Return the unauthorised session
    return {
      session: null,
      sessionError,
      prisma,
      supertokens,
    };
  }
};

/**
 * Initialize the database. This must be called before registering the API on
 * a server.
 */
const initDb = async () => {
  try {
    // ... you will write your Prisma Client queries here
    await prisma.$connect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    throw e;
  }
  await prisma.$disconnect();
};

/**
 * Setup the Fastify server with tRPC.
 * @param server
 */
export const setupFastifyTrpc = async (server: FastifyInstance) => {
  await initDb();

  await server.register(fastifyTRPCPlugin, {
    prefix: TRPC_ENDPOINT,
    trpcOptions: {
      router: appRouter,
      createContext: createTRPCContext,
      onError({ path, error }) {
        // report to error monitoring
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
  });
};
