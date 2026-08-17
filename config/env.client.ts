import {z} from "zod";

const clientEnvSchema = z.object({
  // Backend REST belum ada — dibiarkan optional sampai ISSUE-15.
  NEXT_PUBLIC_API_BASE_URL: z.url().optional(),
  NEXT_PUBLIC_APP_URL: z.url().optional(),
  NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER: z.string().optional(),
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER:
    process.env.NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER,
});
