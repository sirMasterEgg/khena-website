import {z} from "zod";

const clientEnvSchema = z.object({
  // Wajib — dipakai langsung oleh browser untuk memanggil backend auth
  // (better-auth). Salah konfigurasi harus ketahuan saat start, bukan saat
  // user klik login.
  NEXT_PUBLIC_API_BASE_URL: z.url(),
  NEXT_PUBLIC_APP_URL: z.url().optional(),
  NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER: z.string().optional(),
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER:
    process.env.NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER,
});
