import {createAuthClient} from "better-auth/react";
import {inferAdditionalFields} from "better-auth/client/plugins";
import {clientEnv} from "@/config/env.client";

/**
 * Klien better-auth untuk auth USER (pengunjung website).
 *
 * baseURL wajib sudah menunjuk sampai `/auth`. Kalau hanya diberi
 * `http://localhost:5000/api`, better-auth menganggap path itu sudah final
 * (karena path-nya bukan "/") dan request akan menembak /api/sign-in/email —
 * 404. Lihat `withPath()` di better-auth/dist/utils/url.mjs.
 *
 * `credentials: "include"` sudah jadi default klien ini, jadi cookie sesi ikut
 * terkirim lintas origin tanpa konfigurasi tambahan.
 */
export const authClient = createAuthClient({
  baseURL: `${clientEnv.NEXT_PUBLIC_API_BASE_URL}/auth`,
  plugins: [
    // Backend menambah field `phone` di luar bawaan better-auth. Tanpa plugin
    // ini, `phone` tidak ada di tipe user maupun di payload signUp.
    inferAdditionalFields({
      user: {phone: {type: "string", required: true, input: true}},
    }),
  ],
});

export type AuthUser = typeof authClient.$Infer.Session.user;
