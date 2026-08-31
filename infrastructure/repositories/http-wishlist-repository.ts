import type {WishlistPage, WishlistRepository} from "@/domain/repositories/wishlist-repository";
import {API_ENDPOINTS} from "@/infrastructure/api/endpoints";
import {apiClient} from "@/infrastructure/api/client";
import {toPageMeta} from "@/infrastructure/api/mappers/catalog";
import {toWishlistItems} from "@/infrastructure/api/mappers/wishlist";

/** Limit besar khusus pemindaian sku (state hati), bukan untuk UI. */
const SKU_SCAN_LIMIT = 100;
/** Jaring pengaman kalau `meta.totalPages` dari server tidak masuk akal. */
const MAX_SCAN_PAGES = 20;

/**
 * Wishlist user — contract.md Bagian 35. Transport `apiClient` (axios), bukan
 * `serverFetch`: seluruh operasinya dipicu interaksi browser dan bergantung
 * pada cookie sesi better-auth milik user, jadi tidak ada yang bisa dirender
 * atau di-cache di server.
 */
export class HttpWishlistRepository implements WishlistRepository {
  async listPage(page: number, limit: number, signal?: AbortSignal): Promise<WishlistPage> {
    const res = await apiClient.get(API_ENDPOINTS.wishlists.list, {
      params: {page, limit},
      signal,
    });
    // `res.data` = envelope {data, meta}.
    return {items: toWishlistItems(res.data.data), meta: toPageMeta(res.data.meta)};
  }

  async listAllSkus(signal?: AbortSignal): Promise<string[]> {
    const skus: string[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const {items, meta} = await this.listPage(page, SKU_SCAN_LIMIT, signal);
      for (const item of items) skus.push(item.product.sku);
      totalPages = meta.totalPages;
      page += 1;
    } while (page <= totalPages && page <= MAX_SCAN_PAGES);

    return skus;
  }

  async add(sku: string): Promise<void> {
    // Idempoten di backend: 201 kalau baru, 200 kalau sudah ada. Keduanya
    // sukses, jadi tidak perlu dibedakan di sini.
    await apiClient.post(API_ENDPOINTS.wishlists.add, {sku});
  }

  async remove(sku: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.wishlists.remove(sku));
  }
}
