import type { User } from "@microsoft/microsoft-graph-types";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  disableUser,
  enableUser,
  getUser,
  getUsers,
  resetUserPassword,
} from "../../common/graph";

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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: error,
        });
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
        return true;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: error,
        });
      }
    }),
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (!ctx.session?.accessToken) {
        throw new Error("No access token");
      }
      return (await getUsers(ctx.session.accessToken)) as User[];
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred, please try again later.",
        cause: error,
      });
    }
  }),
  getUser: protectedProcedure
    .input(
      z.object({
        userId: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        if (!ctx.session?.accessToken) {
          throw new Error("No access token");
        }
        if (!input.userId) {
          throw new Error("No user id");
        }
        return (await getUser(ctx.session.accessToken, input.userId)) as User;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: error,
        });
      }
    }),

  resetUserPassword: protectedProcedure
    .input(z.object({ userId: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session?.accessToken) {
          throw new Error("No access token");
        }
        await resetUserPassword({
          userId: input.userId,
          password: input.password,
          accessToken: ctx.session.accessToken,
        });
        console.log("Password Reset");
        return true;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: error,
        });
      }
    }),
});
