import {z} from "zod";

/** Satu kategori di dalam room type — contract.md Bagian 32. */
const navCategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
});

/** Satu room type beserta kategorinya. */
const navRoomGroupSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  // Room type tanpa kategori published tetap dikirim backend dengan array kosong.
  categories: z.array(navCategorySchema).catch([]),
});

/**
 * `.nullable().catch(null)` per item: satu baris yang bentuknya rusak jadi `null`
 * lalu dibuang di mapper, sisanya tetap tampil. `.catch([])` di level array adalah
 * jaring terakhir kalau `data` ternyata bukan array sama sekali.
 */
export const navRoomGroupsSchema = z
  .array(navRoomGroupSchema.nullable().catch(null))
  .catch([]);

/** Satu koleksi — contract.md Bagian 34. Field gambar & statistik tidak dipakai navbar. */
const navCollectionSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
});

export const navCollectionsSchema = z
  .array(navCollectionSchema.nullable().catch(null))
  .catch([]);
