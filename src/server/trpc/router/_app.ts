import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { graphRouter } from './graph';

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  graph: graphRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
