import Link from "next/link";
import {Tile} from "@/presentation/components/ui/tile";
import {RemoteImage} from "@/presentation/components/ui/remote-image";
import {WishlistButton} from "@/presentation/components/product/wishlist-button";
import type {FeaturedProduct} from "@/domain/entities/featured-product";
import {cn} from "@/presentation/lib/cn";

export type FeaturedProductCardProps = {
  product: FeaturedProduct;
  className?: string;
};

/**
 * Kartu produk "Designed for Life" — bagian Fase 6 issue #27. Kartu terpisah
 * dari `ProductCard`: tanpa harga, tanpa `QuickAddButton` (entity
 * `FeaturedProduct` memang tidak membawa data itu), tetap ada
 * `WishlistButton` karena hanya butuh `productId` + `productName`.
 */
export function FeaturedProductCard({product, className}: FeaturedProductCardProps) {
  return (
    <Link href={`/product/${product.sku}`} className={cn("block", className)}>
      <Tile className="aspect-[383/384] bg-warm">
        <div className="absolute inset-10 flex items-center justify-center">
          <RemoteImage
            src={product.image}
            alt={product.name}
            label={product.name}
            className="transition-transform duration-1400 ease-brand group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>

        {product.soldOut ? (
          <span className="absolute left-4 top-4 bg-ink/82 px-2 py-1 text-xs uppercase tracking-label text-invert">
            Sold Out
          </span>
        ) : null}

        <WishlistButton
          productId={product.id}
          productName={product.name}
          className="absolute right-4 top-4"
        />
      </Tile>

      <div className="mt-4 space-y-1">
        <p className="text-sm">{product.name}</p>
      </div>
    </Link>
  );
}
