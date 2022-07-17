import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../db/client";

export const teamRouter = createRouter()
  .mutation("create-team", {
    async resolve() {
      return await prisma.team.create({
        data: {},
      });
    },
  })
  .mutation("add-player", {
    input: z.object({
      teamID: z.string().cuid(),
      playerID: z.string().cuid(),
    }),
    async resolve({ input }) {
      return await prisma.team.update({
        where: {
          id: input.teamID,
        },
        data: {
          players: {
            connect: {
              id: input.playerID,
            },
          },
        },
      });
    },
  })
  .mutation("remove-player", {
    input: z.object({
      teamID: z.string().cuid(),
      playerID: z.string().cuid(),
    }),
    async resolve({ input }) {
      return await prisma.team.update({
        where: {
          id: input.teamID,
        },
        data: {
          players: {
            disconnect: {
              id: input.playerID,
            },
          },
        },
      });
    },
  })
  .query("get-all-teams", {
    async resolve() {
      return await prisma.team.findMany({
        select: {
          id: true,
          players: true,
        },
      });
    },
  });
