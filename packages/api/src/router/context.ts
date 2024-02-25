import { prisma } from "../db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const contextRouter = createTRPCRouter({
  getContext: publicProcedure.query(async ({ ctx }) => {
    return {
      users: await prisma.user.findFirst(),
      ...ctx,
    };
  }),
});
