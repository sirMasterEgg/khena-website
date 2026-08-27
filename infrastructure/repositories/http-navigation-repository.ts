import type {NavigationRepository} from "@/domain/repositories/navigation-repository";
import type {NavCollection, NavRoomGroup, NavigationMenu} from "@/domain/entities/navigation";
import {API_ENDPOINTS} from "@/infrastructure/api/endpoints";
import {serverFetch} from "@/infrastructure/api/server-fetch";
import {toNavCollections, toNavRoomGroups} from "@/infrastructure/api/mappers/navigation";

/** Dropdown SHOP menampilkan 3 room teratas — paginasi endpoint ini per room type. */
const ROOM_LIMIT = 3;
/** Sama dengan default backend; membatasi agar baris koleksi di dropdown tidak meluber. */
const COLLECTION_LIMIT = 10;

const REVALIDATE_SECONDS = 300;

export class HttpNavigationRepository implements NavigationRepository {
  async get(): Promise<NavigationMenu> {
    // Dua sumber ditangani terpisah: kalau /collections mati, dropdown SHOP tetap
    // punya isi (dan sebaliknya).
    const [shopGroups, collections] = await Promise.all([
      this.getShopGroups(),
      this.getCollections(),
    ]);
    return {shopGroups, collections};
  }

  private async getShopGroups(): Promise<NavRoomGroup[]> {
    try {
      const raw = await serverFetch<unknown>(API_ENDPOINTS.categories.list, {
        query: {page: 1, limit: ROOM_LIMIT},
        revalidateSeconds: REVALIDATE_SECONDS,
        tags: ["navigation", "categories"],
      });
      return toNavRoomGroups(raw);
    } catch (error) {
      console.error("[navigation] gagal memuat kategori, dropdown SHOP dikosongkan", error);
      return [];
    }
  }

  private async getCollections(): Promise<NavCollection[]> {
    try {
      const raw = await serverFetch<unknown>(API_ENDPOINTS.collections.list, {
        query: {page: 1, limit: COLLECTION_LIMIT},
        revalidateSeconds: REVALIDATE_SECONDS,
        tags: ["navigation", "collections"],
      });
      return toNavCollections(raw);
    } catch (error) {
      console.error("[navigation] gagal memuat koleksi, dropdown COLLECTION dikosongkan", error);
      return [];
    }
  }
}
