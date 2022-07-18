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
      try {
        return await prisma.$transaction(async () => {
          const team = await prisma.team.findUnique({
            where: {
              id: input.teamID,
            },
            select: {
              players: true,
            },
          });

          if (team && team.players && team.players.length >= 2) {
            throw new Error("Cannot have a team with more than two players");
          }

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
        });
      } catch {}
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
  .mutation("clear-all-teams", {
    async resolve() {
      return await prisma.player.updateMany({
        data: {
          teamId: "",
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
