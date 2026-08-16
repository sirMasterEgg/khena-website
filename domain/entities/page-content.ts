/**
 * Konten CMS per halaman. Rilis pertama hanya landing yang bisa diedit lewat
 * ini (bagian 7 issue.md, pertanyaan #5) — halaman lain tetap statis di kode.
 */
export type PageContentKey = "landing";

export type PageContent = {
  key: PageContentKey;
  heroEyebrow: string;
  heroHeadline: string;
  heroImageLabel: string;
  heroCtaLabel: string;
};
