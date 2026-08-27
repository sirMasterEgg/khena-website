export const API_ENDPOINTS = {
  pages: {
    // BUKAN "/api/pages" — base URL sudah mengandung /api.
    // BUKAN "/admin/pages" — itu endpoint dashboard admin.
    list: "/pages",
  },
  products: {
    detail: (id: string) => `/products/${id}`,
  },
} as const;
