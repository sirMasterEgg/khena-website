import {Button} from "@/presentation/components/ui/button";
import {FeaturedProductCard} from "@/presentation/components/product/featured-product-card";
import {RevealStagger} from "@/presentation/components/motion/reveal-stagger";
import type {FeaturedProduct} from "@/domain/entities/featured-product";

/**
 * "Designed for Life" — etalase, tanpa harga & quick-add (bagian 4.1
 * issue.md). Judul & CTA belum ada di struktur CMS (`designedForLife` hanya
 * punya `productIds`) — biarkan hardcode sampai dijawab (Pertanyaan Terbuka
 * #2 issue #27).
 */
export function DesignedForLife({products}: {products: FeaturedProduct[]}) {
  if (products.length === 0) return null;

  return (
    <section className="pt-30">
      <div className="mx-auto max-w-355 px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-h2">Designed for Life</h2>
          <Button href="/collections">Discover Collection →</Button>
        </div>

        <RevealStagger className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
