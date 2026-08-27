export const API_ENDPOINTS = {
  pages: {
    // BUKAN "/api/pages" — base URL sudah mengandung /api.
    // BUKAN "/admin/pages" — itu endpoint dashboard admin.
    list: "/pages",
  },
  products: {
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
} as const;
