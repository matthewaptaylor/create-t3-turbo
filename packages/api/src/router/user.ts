import { TRPCError } from "@trpc/server";

import { userGetInfoOutput } from "@acme/validators";

import { createTRPCRouter, protectedProcedureWithUser } from "../trpc";

export const userRouter = createTRPCRouter({
  getInfo: protectedProcedureWithUser
    .output(userGetInfoOutput)
    .query(({ ctx }) => {
      const currentLoginMethod = ctx.user.loginMethods.find(
        (method) =>
          method.recipeUserId.getAsString() === ctx.session.recipeUserId,
      );
      if (currentLoginMethod === undefined)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" }); // Should never happen

      return {
        email: currentLoginMethod.email,
      };
    }),
});
