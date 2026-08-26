import type {FeaturedProductRepository} from "@/domain/repositories/featured-product-repository";
import type {FeaturedProduct} from "@/domain/entities/featured-product";
import {API_ENDPOINTS} from "@/infrastructure/api/endpoints";
import {serverFetch} from "@/infrastructure/api/server-fetch";
import {productDetailSchema} from "@/infrastructure/api/schemas/product";
import {toFeaturedProduct} from "@/infrastructure/api/mappers/featured-product";

// Tidak ada endpoint batch untuk produk (contract.md bagian 33) — satu request
// per id. Batasi beban: ambil maksimal ID_LIMIT id pertama, potong hasil akhir
// ke RESULT_LIMIT produk (jumlah yang ditampilkan sekarang).
const ID_LIMIT = 12;
const RESULT_LIMIT = 3;

export class HttpFeaturedProductRepository implements FeaturedProductRepository {
  async getByIds(ids: string[]): Promise<FeaturedProduct[]> {
    const targetIds = ids.slice(0, ID_LIMIT);

    // Promise.allSettled, BUKAN Promise.all — satu id yang sudah di-unpublish
    // mengembalikan 400 dan tidak boleh menjatuhkan seluruh section.
    // allSettled menjaga urutan index (urutan editorial dari CMS), jadi hasil
    // gagal cukup dibuang tanpa perlu disortir ulang.
    const results = await Promise.allSettled(
      targetIds.map((id) =>
        serverFetch<unknown>(API_ENDPOINTS.products.detail(id), {
          revalidateSeconds: 300,
          tags: ["products:detail", `products:detail:${id}`],
        })
      )
    );

    const products: FeaturedProduct[] = [];
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.warn(`[featured-product] gagal memuat produk ${targetIds[index]}`, result.reason);
        return;
      }
      const parsed = productDetailSchema.safeParse(result.value);
      if (!parsed.success) {
        console.warn(`[featured-product] bentuk data tidak valid untuk produk ${targetIds[index]}`);
        return;
      }
      products.push(toFeaturedProduct(parsed.data));
    });

    return products.slice(0, RESULT_LIMIT);
  }
}
