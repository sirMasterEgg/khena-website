// Data statis untuk halaman /info/[slug] yang belum/tidak dari CMS — bagian
// 4.9 issue.md. `shipping`, `returns`, `contract` pindah ke CMS (issue #27,
// lihat presentation/lib/info-fallback.ts untuk eyebrow/title/intro-nya).

export type InfoPageRenderMode = "prose" | "accordion" | "cards";

export type InfoSection = {
  title: string;
  body: string;
};

export type StaticInfoPageSlug = "terms" | "privacy";

export type StaticInfoPage = {
  slug: StaticInfoPageSlug;
  eyebrow: string;
  title: string;
  intro: string;
  mode: InfoPageRenderMode;
  sections: InfoSection[];
};

export const STATIC_INFO_PAGES: Record<StaticInfoPageSlug, StaticInfoPage> = {
  terms: {
    slug: "terms",
    eyebrow: "Legal",
    title: "Terms & Conditions",
    intro: "The terms below govern your use of the Khena website and any purchase made through it.",
    mode: "prose",
    sections: [
      {
        title: "Orders",
        body: "All orders are subject to acceptance and availability. Prices are shown in Indonesian Rupiah and include applicable tax.",
      },
      {
        title: "Payment",
        body: "Payment is processed securely through our payment partner at checkout. Orders are confirmed once payment clears.",
      },
      {
        title: "Product Information",
        body: "We take care to describe our pieces accurately; natural materials mean slight variation between individual items is expected.",
      },
      {
        title: "Liability",
        body: "Khena's liability is limited to the value of the order. Nothing here affects your statutory consumer rights.",
      },
    ],
  },
  privacy: {
    slug: "privacy",
    eyebrow: "Legal",
    title: "Privacy Policy",
    intro: "We collect only what's needed to process your order and improve your experience with Khena.",
    mode: "accordion",
    sections: [
      {
        title: "What We Collect",
        body: "Contact details, delivery address, and order history — provided directly by you when you shop or get in touch.",
      },
      {
        title: "How We Use It",
        body: "To fulfil orders, respond to enquiries, and — with consent — send occasional updates about new collections.",
      },
      {
        title: "Data Sharing",
        body: "We share data only with delivery partners and our payment processor, strictly to complete your order.",
      },
      {
        title: "Your Rights",
        body: "You may request a copy of your data or ask us to delete it at any time by contacting hello@khena.co.id.",
      },
    ],
  },
};

export const STATIC_INFO_SLUGS = Object.keys(STATIC_INFO_PAGES) as StaticInfoPageSlug[];

// --- Catalogue -------------------------------------------------------------

export const CATALOGUE_META = {
  edition: "2026 Edition",
  pages: "84 Pages",
  format: "PDF",
  fileSize: "12.4 MB",
};

export const CATALOGUE_INDUSTRIES = [
  "Interior Design",
  "Architecture",
  "Hospitality & Hotels",
  "Real Estate & Development",
  "Food & Beverage",
  "Private Customer",
  "Other",
] as const;
