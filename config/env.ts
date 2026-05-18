import "server-only";
import {z} from "zod";

const serverEnvSchema = z.object({
  APP_NAME: z.string().optional(),
});

export const serverEnv = serverEnvSchema.parse({
  APP_NAME: process.env.APP_NAME,
});
