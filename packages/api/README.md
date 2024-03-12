# @acme/api

This package is responsible for defining the tRPC API for the Acme app. It is designed to run on any server with a tRPC adapter.

## Usage

There are some required steps when running the API on a server

1. First you can set up the adapter. In this example, we use the `fastify` adapter.

```ts
import type { FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";

import type { AppRouter } from "@acme/api";
import { appRouter } from "@acme/api";

await fastify.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext: createTRPCContext, // Explained in the next step
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});
```

3. The adapter requires a `createContext` function. This function is responsible for generating the context for each request. We use it to handle authentication.

```ts
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

import type { Session, TRPCContext } from "@acme/api";
import { appRouter, SessionErrorEnum } from "@acme/api";

const createTRPCContext = async ({
  req,
  res,
}: CreateFastifyContextOptions): Promise<TRPCContext> => {
  try {
    // Get user session
    const session: Session = yourOwnAuthFunction();

    return {
      session,
      sessionError: null,
      prisma,
      supertokens,
    };
  } catch (e) {
    // Could not get user session, return error
    const sessionError: SessionErrorEnum = e.type;

    return {
      session: null,
      sessionError: e,
      prisma,
      supertokens,
    };
  }
};
```
