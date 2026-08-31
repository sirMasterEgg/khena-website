export const API_ENDPOINTS = {
  pages: {
    // BUKAN "/api/pages" — base URL sudah mengandung /api.
    // BUKAN "/admin/pages" — itu endpoint dashboard admin.
    list: "/pages",
  },
  products: {
    // contract.md Bagian 33 — dipakai fitur search (query `search`).
    list: "/products",
    detail: (id: string) => `/products/${id}`,
  },
  // Room type + kategori published, dua level sekaligus — contract.md Bagian 32.
  // BUKAN "/admin/categories" (Bagian 9, bentuk datanya berbeda) dan BUKAN
  // "/admin/room-types" (Bagian 8, endpoint admin).
  categories: {
    list: "/categories",
  },
  // contract.md Bagian 34. BUKAN "/admin/collections".
  collections: {
    list: "/collections",
  },
  // contract.md Bagian 35. BUKAN "/admin/wishlists" (tidak ada di kontrak) dan
  // BUKAN "/api/wishlists" — base URL sudah mengandung /api.
  wishlists: {
    list: "/wishlists",
    add: "/wishlists",
    /** `sku` = products.base_sku, bukan id baris wishlist. */
    remove: (sku: string) => `/wishlists/${encodeURIComponent(sku)}`,
  },
  // contract.md Bagian 37. BUKAN "/admin/jobs" (Bagian 26, endpoint dashboard
  // admin dengan bentuk data berbeda) dan BUKAN "/api/careers" (base URL sudah
  // mengandung /api).
  careers: {
    list: "/careers",
    /** Menerima uuid ATAU slug. */
    detail: (idOrSlug: string) => `/careers/${idOrSlug}`,
    apply: "/careers/apply",
  },
} as const;
