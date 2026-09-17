"use client";

import {redirect} from "next/navigation";

/**
 * Pindah ke halaman pembayaran Midtrans. `redirect()` dipanggil saat RENDER
 * (bukan di event handler) — satu-satunya pola yang didukung Next.js di
 * Client Component, dan menerima URL absolut (lihat
 * node_modules/next/dist/docs/01-app/03-api-reference/04-functions/redirect.md).
 * Issue #43.
 */
export function PaymentRedirect({url}: {url: string}) {
  redirect(url);
  // Baris ini tidak pernah tercapai — `redirect()` selalu melempar. Ada di
  // sini hanya supaya TypeScript menyimpulkan tipe kembalian komponen ini
  // sebagai `ReactNode`, bukan `void`.
  return null;
}
