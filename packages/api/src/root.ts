import { contextRouter } from "./router/context";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  context: contextRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
