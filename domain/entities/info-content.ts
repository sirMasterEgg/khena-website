/**
 * Konten halaman /info/[slug] yang berasal dari CMS — bagian Fase 7-9
 * issue #27.
 */

export type QaItem = {
  id: string;
  question: string;
  answer: string;
  category: string; // "" berarti tidak dikelompokkan
  updatedAt: string;
};

export type QaPageKey = "faq" | "care" | "shipping" | "returns";

export type AssemblyManual = {
  id: string;
  fileUrl: string;
  fileName: string;
  fileSize: string; // teks siap tampil, mis. "700 KB" — jangan diformat ulang
  productSku: string; // boleh ""
  productName: string;
  updatedAt: string;
};

export type ContractProject = {
  id: string;
  field: string;
  description: string;
  updatedAt: string;
};
