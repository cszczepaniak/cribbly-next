import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../db/client";

export const divisionRouter = createRouter()
  .mutation("create", {
    input: z.object({
      name: z.string().min(2).max(36),
    }),
    async resolve({ input }) {
      return await prisma.division.create({
        data: {
          name: input.name,
        },
      });
    },
  })
  .mutation("add-team", {
    input: z.object({
      teamID: z.string().cuid(),
      divisionID: z.string().cuid(),
    }),
    async resolve({ input }) {
      return await prisma.division.update({
        data: {
          teams: {
            connect: {
              id: input.teamID,
            },
          },
        },
        where: {
          id: input.divisionID,
        },
      });
    },
  })
  .mutation("remove-team", {
    input: z.object({
      teamID: z.string().cuid(),
      divisionID: z.string().cuid(),
    }),
    async resolve({ input }) {
      return await prisma.division.update({
        where: {
          id: input.divisionID,
        },
        data: {
          teams: {
            disconnect: {
              id: input.teamID,
            },
          },
        },
      });
    },
  })
  .mutation("clear-all", {
    async resolve() {
      return await prisma.team.updateMany({
        data: {
          divisionID: "",
        },
      });
    },
  })
  .query("get-all", {
    async resolve() {
      return await prisma.division.findMany({
        select: {
          id: true,
          name: true,
          teams: {
            select: {
              id: true,
              divisionID: true,
              players: true,
            },
          },
        },
      });
    },
  });
