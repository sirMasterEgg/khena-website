/**
 * Bentuk lowongan dari API publik `GET /api/careers` (contract.md Bagian 37).
 * Relasi `department` & `employmentType` sengaja sudah diratakan jadi nama saja
 * di mapper — UI tidak memakai id-nya (D2).
 */
export type CareerSummary = {
  id: string;
  slug: string;
  positionTitle: string;
  /** mis. "Full-time", "Contract". Kosong bila relasi belum diisi admin. */
  employmentType: string;
  department: string;
  location: string;
};

/** Tambahan dari `GET /api/careers/:id`. */
export type CareerDetail = CareerSummary & {
  roleDescription: string;
  requirements: string;
  /** `null` di API → `undefined` di sini. */
  benefits?: string;
};
