// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./auth";
import { playerRouter } from "./players";
import { adminRouter } from "./admin";
import { teamRouter } from "./teams";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("player.", playerRouter)
  .merge("team.", teamRouter)
  .merge("auth.", authRouter)
  .merge("admin.", adminRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
