import {z} from "zod";
import {optionalImageObject, optionalImageUrl, optionalPositiveInt, optionalText} from "@/infrastructure/api/schemas/common";

/** Baris mentah dari GET /pages — contract.md bagian 31. */
export const pageRowSchema = z.object({
  id: z.string(),
  page: z.string(),
  section: z.string(),
  data: z.unknown(),
});
export type PageRow = z.infer<typeof pageRowSchema>;

export const pageRowsSchema = z.array(pageRowSchema).catch([]);

/** Ambil `data` milik satu section dari daftar baris. */
export function findSectionData(rows: PageRow[], section: string): unknown {
  return rows.find((row) => row.section === section)?.data;
}

// --- home ------------------------------------------------------------------

/** `mainHero` & `bottomHero` — bentuknya identik. */
export const heroSectionSchema = z.object({
  eyebrow: optionalText,
  headline: optionalText,
  image: optionalImageObject,
  ctaLabel: optionalText,
  ctaHref: optionalText,
});

export const craftmanshipSlideSchema = z.object({
  title: optionalText,
  body: optionalText,
  // Gambar slide craftmanship tetap string URL polos, BUKAN objek {url, alt} —
  // lihat Pertanyaan Terbuka #1 issue #27.
  image: optionalImageUrl,
});

export const craftmanshipSectionSchema = z.object({
  eyebrow: optionalText,
  slides: z.array(craftmanshipSlideSchema).optional().catch(undefined),
  intervalMs: optionalPositiveInt,
  ctaLabel: optionalText,
  ctaHref: optionalText,
});

export const signatureCollectionSectionSchema = z.object({
  title: optionalText,
  image: optionalImageObject,
});

export const designedForLifeSectionSchema = z.object({
  productIds: z.array(z.unknown()).optional().catch(undefined),
});

// --- info: faq / care / shipping / returns ----------------------------------

export const qaItemSchema = z.object({
  id: optionalText,
  question: optionalText,
  answer: optionalText,
  category: z.string().optional().catch(undefined),
  updatedAt: optionalText,
});

export const qaItemsSectionSchema = z.object({
  items: z.array(qaItemSchema).optional().catch(undefined),
});

// --- assembly ----------------------------------------------------------------

export const assemblyManualSchema = z.object({
  id: optionalText,
  fileUrl: optionalText,
  fileName: optionalText,
  fileSize: optionalText,
  productSku: z.string().optional().catch(undefined),
  productName: optionalText,
  updatedAt: optionalText,
});

export const assemblyManualsSectionSchema = z.object({
  manuals: z.array(assemblyManualSchema).optional().catch(undefined),
});

// --- contract ------------------------------------------------------------------

export const contractProjectSchema = z.object({
  id: optionalText,
  field: optionalText,
  description: optionalText,
  status: z.enum(["draft", "published"]).optional().catch(undefined),
  updatedAt: optionalText,
});

export const contractProjectsSectionSchema = z.object({
  projects: z.array(contractProjectSchema).optional().catch(undefined),
});
