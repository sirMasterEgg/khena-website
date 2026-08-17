import {Button} from "@/presentation/components/ui/button";
import {ProductCard} from "@/presentation/components/product/product-card";
import {RevealStagger} from "@/presentation/components/motion/reveal-stagger";
import type {Product} from "@/domain/entities/product";

/** "Designed for Life" — etalase, tanpa harga & quick-add (bagian 4.1 issue.md). */
export function DesignedForLife({products}: {products: Product[]}) {
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
            <ProductCard key={product.id} product={product} showPrice={false} showQuickAdd={false} />
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
