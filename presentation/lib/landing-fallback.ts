import type {LandingContent} from "@/domain/entities/landing-content";

/**
 * Fallback landing page — teks disalin persis dari komponen hardcode
 * sebelum issue #27, supaya saat CMS kosong (`{"data":[]}`) tampilan
 * **tidak berubah sama sekali**. Semua `url` gambar sengaja `undefined` —
 * `RemoteImage` jatuh ke `PlaceholderImage`, persis kondisi sekarang.
 */
export const LANDING_FALLBACK: LandingContent = {
  mainHero: {
    eyebrow: "Spring / Summer 2026",
    headline: "Timeless Living",
    image: {url: undefined, alt: "Timeless Living"},
    ctaLabel: "Discover Collection",
    ctaHref: "/collections",
  },
  craftmanship: {
    eyebrow: "Craftsmanship",
    slides: [
      {
        title: "Our Materials",
        body: "Every piece begins with material chosen for how it ages, not just how it looks on day one.",
      },
      {
        title: "Solid Timber",
        body: "Kiln-dried teak and oak, joined with traditional techniques built to outlast trends.",
      },
      {
        title: "Hand-Loomed Textile",
        body: "Woven by artisan partners using natural fibres, dyed in small, considered batches.",
      },
      {
        title: "Natural Stone",
        body: "Quarried stone surfaces, each with its own grain — no two pieces are ever identical.",
      },
    ],
    intervalMs: 1000,
    ctaLabel: "DISCOVER THE MATERIALS",
    ctaHref: "/about",
  },
  signatureCollection: {
    title: "Signature Collection",
    image: {url: undefined, alt: "Signature Collection"},
  },
  bottomHero: {
    eyebrow: "Premium Panels · Refined Finishes · Wood Accents",
    headline: "Every Piece",
    image: {url: undefined, alt: "Every Piece"},
    ctaLabel: "EXPLORE THE RANGE",
    ctaHref: "/shop",
  },
  featuredProductIds: [],
};
