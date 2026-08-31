import type {PageMeta} from "@/domain/entities/pagination";
import type {WishlistItem} from "@/domain/entities/wishlist-item";

export type WishlistPage = {items: WishlistItem[]; meta: PageMeta};

/**
 * Wishlist user website — contract.md Bagian 35. Seluruh method butuh sesi
 * login user (cookie better-auth); tanpa sesi backend membalas 401.
 */
export interface WishlistRepository {
  /** Satu halaman wishlist untuk UI "Saved Pieces". */
  listPage(page: number, limit: number, signal?: AbortSignal): Promise<WishlistPage>;
  /** Seluruh sku tersimpan — dipakai menentukan state hati di kartu produk. */
  listAllSkus(signal?: AbortSignal): Promise<string[]>;
  /** Idempoten di sisi backend: menambah sku yang sudah ada bukan error. */
  add(sku: string): Promise<void>;
  remove(sku: string): Promise<void>;
}
