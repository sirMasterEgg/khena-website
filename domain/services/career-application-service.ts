/** Aturan lampiran, cerminan validasi backend (contract.md Bagian 37) — D6. */
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
export const ALLOWED_ATTACHMENT_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".jpg",
  ".jpeg",
  ".png",
] as const;

export type CareerApplication = {
  /**
   * UUID lowongan. Opsional: user boleh mengirim lamaran spontan tanpa memilih
   * lowongan (D7). Kalau ada, WAJIB uuid — bukan slug.
   */
  jobId?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  /** CV. File asli, bukan sekadar nama file seperti versi mock. */
  attachment?: File;
};

export interface CareerApplicationService {
  submit(application: CareerApplication): Promise<void>;
}
