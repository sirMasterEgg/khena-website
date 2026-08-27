/**
 * Varian tampilan section Signature Collection di landing — issue #27.
 * - "block"    : satu judul + satu gambar dari CMS (section signatureCollection)
 * - "carousel" : carousel banyak koleksi dari GET /api/collections
 *
 * Anotasi tipe union-nya WAJIB ditulis eksplisit — kalau tidak, TypeScript
 * menyempitkannya ke literal dan cabang varian lain dianggap unreachable.
 */
export const SIGNATURE_COLLECTION_VARIANT: "block" | "carousel" = "block";
