import { router } from "../trpc";
import { graphRouter } from "./graph";

export const appRouter = router({
  graph: graphRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
