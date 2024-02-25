import type { FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import type { FastifyInstance } from "fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";

import type { AppRouter } from "@acme/api";
import { appRouter, createTRPCContext } from "@acme/api";

/**
 * Setup the Fastify server with tRPC.
 * @param server
 */
export const setupFastifyTrpc = async (server: FastifyInstance) => {
  await server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
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
