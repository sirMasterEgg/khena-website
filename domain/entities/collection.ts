export type CollectionStatus = "active" | "draft" | "outofstock";
export type CollectionVisibility = "visible" | "hidden";

export type Collection = {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: CollectionStatus;
  visibility: CollectionVisibility;
};

/** Bagian 2.4 issue.md: koleksi tampil kalau visible dan bukan draft. */
export function isCollectionVisible(c: Collection) {
  return c.visibility === "visible" && c.status !== "draft";
}
