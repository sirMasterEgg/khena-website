import {
  craftmanshipSectionSchema,
  designedForLifeSectionSchema,
  findSectionData,
  heroSectionSchema,
  type PageRow,
  signatureCollectionSectionSchema,
} from "@/infrastructure/api/schemas/page";
import {LANDING_FALLBACK} from "@/presentation/lib/landing-fallback";
import type {
  ContentImage,
  CraftmanshipContent,
  CraftmanshipSlide,
  HeroContent,
  LandingContent,
  SignatureCollectionContent,
} from "@/domain/entities/landing-content";

const CRAFTMANSHIP_INTERVAL_MIN_MS = 1000;

/**
 * Ratakan objek gambar CMS `{url, alt}` jadi `ContentImage`. `url` kosong /
 * bukan string -> undefined (komponen jatuh ke placeholder). `alt` kosong ->
 * pakai `fallbackAlt` — gambar tidak boleh pernah lolos tanpa `alt`.
 */
function toContentImage(raw: {url?: string; alt?: string} | undefined, fallbackAlt: string): ContentImage {
  return {
    url: raw?.url,
    alt: raw?.alt ?? fallbackAlt,
  };
}

function toHeroContent(rows: PageRow[], section: string, fallback: HeroContent): HeroContent {
  const parsed = heroSectionSchema.safeParse(findSectionData(rows, section));
  const data = parsed.success ? parsed.data : {};

  const headline = data.headline ?? fallback.headline;
  return {
    eyebrow: data.eyebrow ?? fallback.eyebrow,
    headline,
    image: toContentImage(data.image, headline),
    ctaLabel: data.ctaLabel ?? fallback.ctaLabel,
    ctaHref: data.ctaHref ?? fallback.ctaHref,
  };
}

function toCraftmanshipContent(rows: PageRow[], fallback: CraftmanshipContent): CraftmanshipContent {
  const parsed = craftmanshipSectionSchema.safeParse(findSectionData(rows, "craftmanship"));
  const data = parsed.success ? parsed.data : {};

  const slides: CraftmanshipSlide[] = (data.slides ?? [])
    .filter((slide) => Boolean(slide.title) || Boolean(slide.body))
    .map((slide) => ({
      title: slide.title ?? "",
      body: slide.body ?? "",
      image: slide.image,
    }));

  const intervalMs = data.intervalMs
    ? Math.max(data.intervalMs, CRAFTMANSHIP_INTERVAL_MIN_MS)
    : fallback.intervalMs;

  return {
    eyebrow: data.eyebrow ?? fallback.eyebrow,
    slides: slides.length > 0 ? slides : fallback.slides,
    intervalMs,
    ctaLabel: data.ctaLabel ?? fallback.ctaLabel,
    ctaHref: data.ctaHref ?? fallback.ctaHref,
  };
}

function toSignatureCollectionContent(
  rows: PageRow[],
  fallback: SignatureCollectionContent
): SignatureCollectionContent {
  const parsed = signatureCollectionSectionSchema.safeParse(findSectionData(rows, "signatureCollection"));
  const data = parsed.success ? parsed.data : {};

  const title = data.title ?? fallback.title;
  return {
    title,
    image: toContentImage(data.image, title),
  };
}

function toFeaturedProductIds(rows: PageRow[]): string[] {
  const parsed = designedForLifeSectionSchema.safeParse(findSectionData(rows, "designedForLife"));
  const productIds = parsed.success ? (parsed.data.productIds ?? []) : [];
  return productIds.filter((id): id is string => typeof id === "string" && id.trim().length > 0);
}

/** `GET /api/pages?page=home` -> `LandingContent`, field per field, dengan fallback. */
export function toLandingContent(rows: PageRow[]): LandingContent {
  return {
    mainHero: toHeroContent(rows, "mainHero", LANDING_FALLBACK.mainHero),
    bottomHero: toHeroContent(rows, "bottomHero", LANDING_FALLBACK.bottomHero),
    craftmanship: toCraftmanshipContent(rows, LANDING_FALLBACK.craftmanship),
    signatureCollection: toSignatureCollectionContent(rows, LANDING_FALLBACK.signatureCollection),
    featuredProductIds: toFeaturedProductIds(rows),
  };
}
