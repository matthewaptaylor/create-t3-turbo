import { contextRouter } from "./router/context";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  context: contextRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
