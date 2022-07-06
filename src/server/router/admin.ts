import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../db/client";

export const adminRouter = createRouter()
  .mutation("add-admin", {
    input: z.object({
      email: z.string().email(),
    }),
    async resolve({ input }) {
      return await prisma.admin.create({
        data: {
          email: input.email,
        },
      });
    },
  })
  .query("get-is-admin", {
    async resolve({ ctx }) {
      if (!ctx.session?.user?.email) {
        return { isAdmin: false };
      }
      const admin = await prisma.admin.findFirst({
        where: {
          email: ctx.session.user.email,
        },
        select: {
          email: true,
        },
      });
      console.log(admin);
      if (!admin) {
        return { isAdmin: false };
      }
      return { isAdmin: true };
    },
  });
