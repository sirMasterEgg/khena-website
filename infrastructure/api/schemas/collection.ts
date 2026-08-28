import {z} from "zod";

/**
 * Satu koleksi dari `GET /api/collections` — contract.md Bagian 34.
 *
 * `.nullable().catch(null)` per item: satu baris yang bentuknya rusak jadi
 * `null` lalu dibuang di mapper, sisanya tetap tampil. `.catch([])` di level
 * array adalah jaring terakhir kalau `data` ternyata bukan array.
 *
 * Sengaja TIDAK memakai ulang `navCollectionSchema` di schemas/navigation.ts:
 * navbar hanya butuh id/slug/name, halaman ini butuh gambar & statistik (D6).
 */
const collectionSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  coverImage: z.string().nullable().catch(null),
  heroImage: z.string().nullable().catch(null),
  // Statistik yang rusak tidak boleh membuang seluruh kartu — jatuhkan ke nilai aman.
  totalProducts: z.number().catch(0),
  hasSoldOutProduct: z.boolean().catch(false),
});

export const collectionSummariesSchema = z
  .array(collectionSummarySchema.nullable().catch(null))
  .catch([]);
