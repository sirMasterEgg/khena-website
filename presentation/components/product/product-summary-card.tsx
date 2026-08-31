import Link from "next/link";
import {Tile} from "@/presentation/components/ui/tile";
import {RemoteImage} from "@/presentation/components/ui/remote-image";
import {WishlistButton} from "@/presentation/components/product/wishlist-button";
import {
  isProductSummaryOnSale,
  isProductSummarySoldOut,
  type ProductSummary,
} from "@/domain/entities/product-summary";
import {formatIDR} from "@/presentation/lib/format";
import {cn} from "@/presentation/lib/cn";

export type ProductSummaryCardProps = {
  product: ProductSummary;
  showPrice?: boolean;
  className?: string;
};

/**
 * Kartu produk untuk `/shop`, berbasis `ProductSummary` — issue #32. Komponen
 * terpisah dari `ProductCard` (bukan reuse): `ProductCard` menerima entity
 * `Product` mock dan merender `QuickAddButton` yang butuh `product.colors`,
 * field yang tidak ada di `ProductSummary`. Mengubah `ProductCard` untuk
 * menerima kedua bentuk akan merusak `/categories`, `/collections`, dan PDP
 * (D1, D5 — Tahap 6).
 */
export function ProductSummaryCard({product, showPrice = true, className}: ProductSummaryCardProps) {
  const onSale = isProductSummaryOnSale(product);
  const soldOut = isProductSummarySoldOut(product);

  return (
    // Tautan mengikuti pola featured-product-card.tsx (commit dea77d7). PDP
    // masih mock (Pertanyaan Terbuka #4) — link belum aktif sampai PDP dimigrasikan.
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

        {onSale ? (
          <span className="absolute left-4 top-4 bg-accent px-2 py-1 text-xs uppercase tracking-label text-invert">
            Sale
          </span>
        ) : soldOut ? (
          <span className="absolute left-4 top-4 bg-ink/82 px-2 py-1 text-xs uppercase tracking-label text-invert">
            Sold Out
          </span>
        ) : null}

        <WishlistButton
          sku={product.sku}
          productName={product.name}
          className="absolute right-4 top-4"
        />
      </Tile>

      <div className="mt-4 space-y-1">
        <p className="text-sm">{product.name}</p>
        {showPrice ? (
          onSale ? (
            <p className="flex items-center gap-2 text-sm">
              <span className="text-muted line-through">{formatIDR(product.price)}</span>
              <span className="text-ink">{formatIDR(product.priceAfterDiscount)}</span>
            </p>
          ) : (
            <p className="text-sm text-muted">{formatIDR(product.priceAfterDiscount)}</p>
          )
        ) : null}
      </div>
    </Link>
  );
}
