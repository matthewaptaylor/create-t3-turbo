import type {
  CreateFastifyContextOptions,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import type { FastifyInstance } from "fastify";
import { TRPCError } from "@trpc/server";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { Error as SuperTokensError } from "supertokens-node";
import SuperTokensSession from "supertokens-node/recipe/session";

import type { AppRouter, Session, TRPCContext } from "@acme/api";
import { appRouter, initDb, SessionErrorEnum } from "@acme/api";

export const TRPC_ENDPOINT = "/trpc";

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
    const session: Session = {
      userId: sessionContainer.getUserId(),
    };

    // Return the authorised session
    return {
      session,
      sessionError: null,
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
    };
  }
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
