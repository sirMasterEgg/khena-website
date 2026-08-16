// Data statis untuk 10 halaman /info/[slug] — bagian 4.9 issue.md.

export type InfoPageRenderMode = "prose" | "accordion" | "cards";

export type InfoSection = {
  title: string;
  body: string;
};

export type StaticInfoPageSlug = "shipping" | "returns" | "contract" | "terms" | "privacy";

export type StaticInfoPage = {
  slug: StaticInfoPageSlug;
  eyebrow: string;
  title: string;
  intro: string;
  mode: InfoPageRenderMode;
  sections: InfoSection[];
};

export const STATIC_INFO_PAGES: Record<StaticInfoPageSlug, StaticInfoPage> = {
  shipping: {
    slug: "shipping",
    eyebrow: "Customer Service",
    title: "Shipping",
    intro:
      "Every Khena piece is made to order and delivered with white-glove care. Here's what to expect from dispatch to your door.",
    mode: "prose",
    sections: [
      {
        title: "Lead Time",
        body: "Most pieces are handcrafted to order and ready within 2–4 weeks, depending on the item and finish selected.",
      },
      {
        title: "Delivery Zones",
        body: "We currently deliver across Java and select outer islands. Rates and lead times vary by zone and are shown at checkout.",
      },
      {
        title: "White-Glove Service",
        body: "Larger pieces are delivered and placed in your room of choice by our own delivery team, with packaging removed on-site.",
      },
      {
        title: "Tracking",
        body: "You'll receive a WhatsApp update once your order ships, with a delivery window confirmed 24 hours in advance.",
      },
    ],
  },
  returns: {
    slug: "returns",
    eyebrow: "Customer Service",
    title: "Returns",
    intro:
      "Because every piece is made to order, our returns policy is a little different from off-the-shelf furniture. Here's how it works.",
    mode: "accordion",
    sections: [
      {
        title: "Made-to-Order Pieces",
        body: "As each piece is crafted specifically for your order, we're unable to accept returns for change of mind.",
      },
      {
        title: "Damaged on Arrival",
        body: "Please inspect your delivery on arrival. Report any damage within 48 hours and we'll arrange a repair or replacement at no cost.",
      },
      {
        title: "Manufacturing Defects",
        body: "Pieces are covered by our craftsmanship warranty for 2 years from delivery — see our warranty terms for full details.",
      },
      {
        title: "Cancellations",
        body: "Orders can be cancelled free of charge within 24 hours of purchase, before production begins.",
      },
    ],
  },
  contract: {
    slug: "contract",
    eyebrow: "Professionals",
    title: "Contract Projects",
    intro:
      "We partner with designers, architects, and hospitality teams on furnishing projects of every scale.",
    mode: "cards",
    sections: [
      {
        title: "Trade Pricing",
        body: "Registered design professionals receive preferential pricing on bulk and repeat orders.",
      },
      {
        title: "Custom Specification",
        body: "Adjust dimensions, finishes, and upholstery to match your project's material palette.",
      },
      {
        title: "Dedicated Support",
        body: "A single point of contact manages your order from quote through to final delivery.",
      },
      {
        title: "Project Timelines",
        body: "We work with your construction schedule, coordinating delivery windows around site readiness.",
      },
    ],
  },
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

// --- FAQ ---------------------------------------------------------------

export type FaqCategoryId = "orders" | "shipping" | "products" | "returns";

export const FAQ_CATEGORIES: {id: FaqCategoryId; label: string}[] = [
  {id: "orders", label: "Orders"},
  {id: "shipping", label: "Shipping"},
  {id: "products", label: "Products"},
  {id: "returns", label: "Returns"},
];

export type FaqItem = {
  id: string;
  category: FaqCategoryId;
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    category: "orders",
    question: "How long does an order take to arrive?",
    answer: "Most pieces are made to order and arrive within 2–4 weeks, depending on the item and your delivery zone.",
  },
  {
    id: "faq-2",
    category: "orders",
    question: "Can I change or cancel my order?",
    answer: "Yes — orders can be changed or cancelled free of charge within 24 hours of purchase, before production begins.",
  },
  {
    id: "faq-3",
    category: "shipping",
    question: "Do you deliver outside Java?",
    answer: "We deliver to select outer islands. Shipping cost and timeline are confirmed at checkout based on your address.",
  },
  {
    id: "faq-4",
    category: "shipping",
    question: "Is delivery really complimentary?",
    answer: "Orders above IDR 15,000,000 within Jakarta & Surrounding qualify for complimentary white-glove delivery.",
  },
  {
    id: "faq-5",
    category: "products",
    question: "What materials do you use?",
    answer: "Primarily solid teak and oak, hand-loomed natural textiles, and quarried natural stone — see our Care & Maintenance guide.",
  },
  {
    id: "faq-6",
    category: "products",
    question: "Can I request a custom finish?",
    answer: "Custom finishes are available for contract and trade orders — get in touch with our team to discuss your project.",
  },
  {
    id: "faq-7",
    category: "returns",
    question: "What if my piece arrives damaged?",
    answer: "Report any damage within 48 hours of delivery and we'll arrange a repair or replacement at no cost to you.",
  },
  {
    id: "faq-8",
    category: "returns",
    question: "Do you offer a warranty?",
    answer: "Every piece is covered by our 2-year craftsmanship warranty against manufacturing defects.",
  },
];

// --- Care & Maintenance --------------------------------------------------

export type CareMaterial = {
  id: string;
  label: string;
  intro: string;
  tips: string[];
};

export const CARE_MATERIALS: CareMaterial[] = [
  {
    id: "solid-timber",
    label: "Solid Timber",
    intro: "Our teak and oak pieces are built to age gracefully with a little regular care.",
    tips: [
      "Dust with a soft, dry cloth weekly",
      "Reapply natural oil finish twice a year",
      "Avoid placing directly under direct sunlight or air conditioning vents",
      "Wipe spills immediately with a damp cloth",
    ],
  },
  {
    id: "hand-loomed-textile",
    label: "Hand-Loomed Textile",
    intro: "Natural fibre upholstery softens beautifully over time with gentle handling.",
    tips: [
      "Vacuum weekly with a soft brush attachment",
      "Blot spills — never rub — with a clean, dry cloth",
      "Rotate cushions monthly for even wear",
      "Professional clean recommended once a year",
    ],
  },
  {
    id: "natural-stone",
    label: "Natural Stone",
    intro: "Each stone surface is unique, with natural variation that's part of its character.",
    tips: [
      "Wipe with a soft, dry cloth after use",
      "Always use coasters to prevent moisture rings",
      "Avoid acidic cleaners — use a pH-neutral stone cleaner only",
      "Reseal surfaces annually for porous stone types",
    ],
  },
  {
    id: "metal-accents",
    label: "Metal Accents",
    intro: "Brushed metal hardware and legs need only occasional attention to stay lustrous.",
    tips: [
      "Dust with a dry microfibre cloth",
      "Avoid abrasive cleaners which can dull the brushed finish",
      "Buff lightly with a soft cloth to restore shine",
    ],
  },
];

// --- Assembly manuals ------------------------------------------------------

export type AssemblyManual = {
  id: string;
  productName: string;
  sku: string;
  fileName?: string;
};

export const ASSEMBLY_MANUALS: AssemblyManual[] = [
  {id: "am-1", productName: "Solana Three-Seat Sofa", sku: "SLN-SF-3S", fileName: "SLN-SF-3S-manual.pdf"},
  {id: "am-2", productName: "Solana Lounge Chair", sku: "SLN-LC-01", fileName: "SLN-LC-01-manual.pdf"},
  {id: "am-3", productName: "Solana Coffee Table", sku: "SLN-CT-01"},
  {id: "am-4", productName: "Meridian Dining Table", sku: "MRD-DT-01", fileName: "MRD-DT-01-manual.pdf"},
  {id: "am-5", productName: "Meridian Dining Chair", sku: "MRD-DC-01", fileName: "MRD-DC-01-manual.pdf"},
  {id: "am-6", productName: "Meridian Bed Frame", sku: "MRD-BF-01", fileName: "MRD-BF-01-manual.pdf"},
  {id: "am-7", productName: "Terra Sofa", sku: "TRA-SF-01"},
  {id: "am-8", productName: "Terra Lounge Chair", sku: "TRA-LC-01", fileName: "TRA-LC-01-manual.pdf"},
  {id: "am-9", productName: "Aria Bed Frame", sku: "ARI-BF-01"},
];

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
