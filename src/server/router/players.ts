import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../db/client";

export const playerRouter = createRouter()
  .mutation("create-player", {
    input: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.player.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
        },
      });
    },
  })
  .query("get-all-players", {
    async resolve() {
      return await prisma.player.findMany();
    },
  });
