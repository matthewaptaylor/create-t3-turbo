import { createTRPCRouter, publicProcedure } from "../trpc";

export const contextRouter = createTRPCRouter({
  getContext: publicProcedure.query(async ({ ctx }) => {
    return {
      users: await ctx.prisma.user.findFirst(),
      ...ctx,
    };
  }),
});
