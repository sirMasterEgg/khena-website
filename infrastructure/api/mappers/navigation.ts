import type {NavCollection, NavRoomGroup} from "@/domain/entities/navigation";
import {navCollectionsSchema, navRoomGroupsSchema} from "@/infrastructure/api/schemas/navigation";

/**
 * Room type dengan `categories: []` sengaja dibuang (keputusan D2 issue navbar):
 * kolom kosong di dropdown lebih membingungkan daripada kolom yang tidak ada.
 */
export function toNavRoomGroups(raw: unknown): NavRoomGroup[] {
  return navRoomGroupsSchema
    .parse(raw)
    .filter((row) => row !== null)
    .map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      // Urutan kategori sudah diatur backend (`order` lalu nama) — jangan di-sort ulang.
      categories: row.categories.map((c) => ({id: c.id, slug: c.slug, name: c.name})),
    }))
    .filter((group) => group.categories.length > 0);
}

export function toNavCollections(raw: unknown): NavCollection[] {
  return navCollectionsSchema
    .parse(raw)
    .filter((row) => row !== null)
    .map((row) => ({id: row.id, slug: row.slug, name: row.name}));
}
