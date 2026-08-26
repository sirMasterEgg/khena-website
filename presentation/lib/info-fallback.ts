/**
 * `eyebrow` / `title` / `intro` halaman /info/[slug] — tidak ada slot untuk
 * ini di struktur CMS (`items`/`manuals`/`projects` hanya berisi daftar),
 * jadi disimpan sebagai konstanta di sini sampai dijawab (Pertanyaan Terbuka
 * #3 issue #27). Teks `faq`/`care`/`assembly` disalin dari komponen hardcode
 * sebelumnya; `shipping`/`returns`/`contract` disalin dari
 * `STATIC_INFO_PAGES` (infrastructure/mock/data/info-pages.ts) sebelum
 * dipindah ke sini.
 */

export const FAQ_HEADER = {
  eyebrow: "Customer Service",
  title: "Frequently Asked Questions",
  intro: "Answers to the questions we hear most often — search below or browse by topic.",
};

export const CARE_HEADER = {
  eyebrow: "Information",
  title: "Care & Maintenance",
  intro: "Simple care routines to keep every material looking its best for years to come.",
};

export const SHIPPING_HEADER = {
  eyebrow: "Customer Service",
  title: "Shipping",
  intro:
    "Every Khena piece is made to order and delivered with white-glove care. Here's what to expect from dispatch to your door.",
};

export const RETURNS_HEADER = {
  eyebrow: "Customer Service",
  title: "Returns",
  intro:
    "Because every piece is made to order, our returns policy is a little different from off-the-shelf furniture. Here's how it works.",
};

export const ASSEMBLY_HEADER = {
  eyebrow: "Information",
  title: "Assembly Manuals",
};

export const CONTRACT_HEADER = {
  eyebrow: "Professionals",
  title: "Contract Projects",
  intro: "We partner with designers, architects, and hospitality teams on furnishing projects of every scale.",
};
