/** Bentuk `meta` pada response list backend — contract.md Bagian 1. */
export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
