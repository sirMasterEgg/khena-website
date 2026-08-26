/**
 * Konten landing page yang berasal dari CMS (`GET /api/pages?page=home`) —
 * bagian Fase 3 issue #27. Entity ini selalu **lengkap**: default sudah
 * diterapkan di mapper (`infrastructure/api/mappers/landing-content.ts`),
 * jadi komponen presentasi tidak perlu cek `undefined` ulang.
 */

/**
 * Gambar yang sudah diratakan dari objek CMS `{url, alt}`.
 * `url` boleh kosong (CMS belum diisi) -> komponen jatuh ke placeholder,
 * tapi `alt` selalu ada string-nya supaya tidak pernah lolos tanpa
 * teks alternatif.
 */
export type ContentImage = {url?: string; alt: string};

export type HeroContent = {
  eyebrow: string;
  headline: string;
  image: ContentImage;
  ctaLabel: string;
  ctaHref: string;
};

/** Gambar slide craftmanship tetap string URL polos di sisi CMS. */
export type CraftmanshipSlide = {title: string; body: string; image?: string};

export type CraftmanshipContent = {
  eyebrow: string;
  slides: CraftmanshipSlide[]; // minimal 1 (dijamin mapper)
  intervalMs: number;
  ctaLabel: string;
  ctaHref: string;
};

export type SignatureCollectionContent = {
  title: string;
  image: ContentImage;
};

export type LandingContent = {
  mainHero: HeroContent;
  bottomHero: HeroContent;
  craftmanship: CraftmanshipContent;
  signatureCollection: SignatureCollectionContent;
  featuredProductIds: string[];
};
