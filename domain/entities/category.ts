export type CategoryStatus = "published" | "draft";
export type CategoryRoom = "living-room" | "dining-room" | "bed-room";

export type Category = {
  id: string;
  slug: string;
  name: string;
  /** Grup ruangan untuk mega dropdown SHOP — bagian 3.1 issue.md. */
  room: CategoryRoom;
  blurb: string;
  status: CategoryStatus;
};

export function isCategoryPublished(c: Category) {
  return c.status === "published";
}
