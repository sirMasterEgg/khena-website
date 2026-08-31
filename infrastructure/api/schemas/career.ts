import {z} from "zod";

/** Relasi `{id, name}` dari API. Nama yang rusak jatuh ke string kosong. */
const careerRelationSchema = z
  .object({id: z.string(), name: z.string().catch("")})
  .nullable()
  .catch(null);

const careerSummaryShape = {
  id: z.string(),
  slug: z.string(),
  positionTitle: z.string(),
  employmentType: careerRelationSchema,
  department: careerRelationSchema,
  location: z.string().catch(""),
};

const careerSummarySchema = z.object(careerSummaryShape);

/**
 * Satu baris rusak jadi `null` lalu dibuang di mapper — sisanya tetap tampil.
 * `.catch([])` di level array adalah jaring terakhir kalau `data` bukan array.
 * Pola sama dengan `collectionSummariesSchema` (issue #34).
 */
export const careerSummariesSchema = z
  .array(careerSummarySchema.nullable().catch(null))
  .catch([]);

/**
 * Detail SENGAJA tidak memakai `.catch(...)` di level objek: kalau detail satu
 * lowongan tidak bisa dibaca, panel detail harus menampilkan pesan error (D8),
 * bukan kartu kosong yang membingungkan.
 */
export const careerDetailSchema = z.object({
  ...careerSummaryShape,
  roleDescription: z.string().catch(""),
  requirements: z.string().catch(""),
  benefits: z.string().nullable().catch(null),
});
