import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../db/client";
import { playerSchema } from "@shared/schemas";

export const playerRouter = createRouter()
  .mutation("create-player", {
    input: playerSchema,
    async resolve({ input }) {
      return await prisma.player.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
        },
      });
    },
  })
  .mutation("delete-player", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ input }) {
      return await prisma.player.delete({
        where: {
          id: input.id,
        },
      });
    },
  })
  .mutation("create-many-players", {
    input: z.array(playerSchema),
    async resolve({ input }) {
      return await prisma.player.createMany({
        data: input,
      });
    },
  })
  .query("get-all-players", {
    async resolve() {
      return await prisma.player.findMany();
    },
  });
