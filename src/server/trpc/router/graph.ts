import { z } from "zod";
import { disableUser, enableUser, getUsers } from "../../common/graph";

import { router, protectedProcedure } from "../trpc";

export const graphRouter = router({
  lockUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session?.accessToken) {
          throw new Error("No access token");
        }
        await disableUser(input.userId, ctx.session.accessToken);
        console.log("User Locked");
      } catch (error) {
        console.warn(error);
      }
    }),
  unlockUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session?.accessToken) {
          throw new Error("No access token");
        }
        await enableUser(input.userId, ctx.session.accessToken);
        console.log("User Unlocked");
      } catch (error) {
        console.warn(error);
      }
    }),
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (!ctx.session?.accessToken) {
        throw new Error("No access token");
      }
      return await getUsers(ctx.session.accessToken);
    } catch (error) {
      console.warn(error);
      return [];
    }
  }),
});
