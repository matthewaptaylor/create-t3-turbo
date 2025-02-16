import type { PrismaClient } from "@prisma/client";
import type supertokens from "supertokens-node";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

/**
 * The user session.
 */
export interface Session {
  /**
   * The user ID.
   */
  userId: string;

  /**
   * The user ID specific to the login method used.
   */
  recipeUserId: string;

  /**
   * Whether the user's email is verified.
   */
  emailVerified: boolean;
}

/**
 * The error that occurred when trying to get the user session.
 */
export enum SessionErrorEnum {
  UNAUTHORISED = "UNAUTHORISED",
  TRY_REFRESH_TOKEN = "TRY_REFRESH_TOKEN",
  INVALID_CLAIMS = "INVALID_CLAIMS",
  OTHER = "OTHER",
}

interface AuthorisedSessionContext {
  /**
   * The user session, if they are logged in.
   */
  session: Session;

  sessionError: null;
}

interface UnauthorisedSessionContext {
  session: null;

  /**
   * The error that occurred when trying to get the user session.
   */
  sessionError: SessionErrorEnum;
}

type SessionContext = AuthorisedSessionContext | UnauthorisedSessionContext;

/**
 * The context provided to all tRPC procedures. This is generated by a function
 * provided to the tRPC adapter.
 * @see https://trpc.io/docs/server/context
 */
export type TRPCContext = SessionContext & {
  /**
   * An instance of the Prisma Client.
   */
  prisma: PrismaClient;

  /**
   * An instance of the SuperTokens library.
   */
  supertokens: typeof supertokens;
};

/**
 * The initialised tRPC instance.
 */
const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

/**
 * Create a server-side caller.
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Create a new router or subrouter for the tRPC API.
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure. It does not guarantee that a user querying is
 * authorized, but you can still access user session data if they are logged
 * in.
 * @see https://trpc.io/docs/procedures
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure. It guarantees that a user is logged in.
 */
export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (ctx.session === null) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

export const protectedProcedureWithUser = protectedProcedure.use(
  async ({ ctx, next }) => {
    const user = await ctx.supertokens.getUser(ctx.session.userId);
    if (user === undefined)
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" }); // Should never happen

    return next({
      ctx: {
        ...ctx,
        user,
      },
    });
  },
);
