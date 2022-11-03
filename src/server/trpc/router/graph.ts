import { z } from "zod";
import { getUsers } from "../../../lib/graph";
import { router, protectedProcedure } from "../trpc";

export const graphRouter = router({
  getSecretMessage: protectedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
  lockUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return;
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
    console.log(account);
    return await getUsers(account.access_token);
  }),
});
