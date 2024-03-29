import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../db/client";
import { divisionNameSchema } from "@shared/schemas";

export const divisionRouter = createRouter()
  .mutation("create", {
    input: z.object({
      name: divisionNameSchema,
    }),
    async resolve({ input }) {
      return await prisma.division.create({
        data: {
          name: input.name,
        },
      });
    },
  })
  .mutation("delete", {
    input: z.object({ id: z.string().cuid() }),
    async resolve({ input }) {
      return await prisma.$transaction([
        prisma.division.update({
          where: {
            id: input.id,
          },
          data: {
            teams: {
              set: [],
            },
          },
        }),
        prisma.division.delete({
          where: {
            id: input.id,
          },
        }),
      ]);
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
  .mutation("set-name", {
    input: z.object({
      id: z.string().cuid(),
      name: divisionNameSchema,
    }),
    async resolve({ input }) {
      return await prisma.division.update({
        data: {
          name: input.name,
        },
        where: {
          id: input.id,
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
