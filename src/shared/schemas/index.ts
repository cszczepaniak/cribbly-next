import { z } from "zod";

export const playerSchema = z.object({
  firstName: z
    .string()
    .regex(/^[a-zA-Z]+$/, { message: "Name can only contain letters" }),
  lastName: z
    .string()
    .regex(/^[a-zA-Z]+$/, { message: "Name can only contain letters" }),
});
