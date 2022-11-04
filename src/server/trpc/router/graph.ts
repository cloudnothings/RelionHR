import { z } from "zod";
import { disableUser, enableUser, getUsers } from "../../../lib/graph";
import { router, protectedProcedure } from "../trpc";

export const graphRouter = router({
  getSecretMessage: protectedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
  lockUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.prisma.account.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });
      if (!account?.access_token) {
        return "No Access Token";
      }
      try {
        await disableUser(input.userId, account.access_token);
        console.log("User Locked");
      } catch (error) {
        console.log(error);
      }
    }),
  unlockUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.prisma.account.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });
      if (!account?.access_token) {
        return "No Access Token";
      }
      try {
        await enableUser(input.userId, account.access_token);
        console.log("User Unlocked");
      } catch (error) {
        console.log(error);
      }
    }),
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const account = await ctx.prisma.account.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });
    if (!account?.access_token) {
      return "No Access Token";
    }
    try {
      return await getUsers(account.access_token);
    } catch (error) {
      console.log(error);
      return [];
    }
  }),
});
