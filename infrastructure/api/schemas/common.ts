import {z} from "zod";

/**
 * Helper Zod bersama untuk memvalidasi `data` bebas (jsonb) yang dikirim CMS
 * lewat `GET /api/pages` — bagian Fase 1 issue #27. Prinsipnya: satu field
 * yang salah tipe tidak boleh mematikan seluruh section, jadi setiap field
 * `.optional().catch(undefined)` alih-alih melempar error parse.
 */

/** String yang di-trim; kosong / salah tipe jadi undefined. */
export const optionalText = z.string().trim().min(1).optional().catch(undefined);

/** URL gambar; kosong / salah tipe jadi undefined. */
export const optionalImageUrl = z.string().trim().min(1).optional().catch(undefined);

/** Angka bulat positif; selain itu undefined. */
export const optionalPositiveInt = z.number().int().positive().optional().catch(undefined);

/**
 * Objek gambar CMS `{url, alt}` — dipakai `mainHero`, `bottomHero`, dan
 * `signatureCollection`. Objek yang bentuknya salah (mis. dikirim sebagai
 * string) jadi undefined, bukan error.
 */
export const optionalImageObject = z
  .object({url: optionalImageUrl, alt: optionalText})
  .optional()
  .catch(undefined);

/** Bentuk `meta` pada response list berpaginasi (contract.md Bagian 1). */
export const pageMetaSchema = z
  .object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  })
  // `meta` rusak/absen tidak boleh mematikan halaman — anggap satu halaman penuh.
  .catch({page: 1, limit: 0, total: 0, totalPages: 1});
