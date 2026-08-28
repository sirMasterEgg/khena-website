import type {CatalogCategory, CatalogCollection} from "@/domain/entities/catalog";
import type {PageMeta} from "@/domain/entities/pagination";
import {navCollectionsSchema, navRoomGroupsSchema} from "@/infrastructure/api/schemas/navigation";
import {pageMetaSchema} from "@/infrastructure/api/schemas/common";

/**
 * Ratakan room type → daftar kategori datar untuk filter bar `/shop`
 * (contract.md Bagian 32). Beda dari `toNavRoomGroups` (navbar): itu
 * mempertahankan dua level (room → kategori), ini butuh satu level datar.
 */
export function toCatalogCategories(raw: unknown): CatalogCategory[] {
  const seen = new Set<string>();
  const flat: CatalogCategory[] = [];

  for (const room of navRoomGroupsSchema.parse(raw)) {
    if (room === null) continue;
    for (const category of room.categories) {
      // Satu kategori bisa muncul di dua room type — buang duplikat berdasar slug.
      if (seen.has(category.slug)) continue;
      seen.add(category.slug);
      flat.push({id: category.id, slug: category.slug, name: category.name});
    }
  }

  return flat;
}

export function toCatalogCollections(raw: unknown): CatalogCollection[] {
  return navCollectionsSchema
    .parse(raw)
    .filter((row) => row !== null)
    .map((row) => ({id: row.id, slug: row.slug, name: row.name}));
}

export function toPageMeta(raw: unknown): PageMeta {
  return pageMetaSchema.parse(raw);
}
