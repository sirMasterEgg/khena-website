import Link from "next/link";
import {Tile} from "@/presentation/components/ui/tile";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import {WishlistButton} from "@/presentation/components/product/wishlist-button";
import {QuickAddButton} from "@/presentation/components/product/quick-add-button";
import {isOnSale, type Product} from "@/domain/entities/product";
import {formatIDR} from "@/presentation/lib/format";
import {cn} from "@/presentation/lib/cn";

export type ProductCardProps = {
  product: Product;
  showPrice?: boolean;
  showQuickAdd?: boolean;
  className?: string;
};

/** Kartu produk dipakai di landing, shop, related pieces — bagian 4.4 issue.md. */
export function ProductCard({
  product,
  showPrice = true,
  showQuickAdd = true,
  className,
}: ProductCardProps) {
  const onSale = isOnSale(product);
  const soldOut = product.stock === 0;

  return (
    <Link href={`/product/${product.id}`} className={cn("block", className)}>
      <Tile className="aspect-[383/384] bg-warm">
        <div className="absolute inset-10 flex items-center justify-center">
          <PlaceholderImage
            label={product.name}
            className="transition-transform duration-1400 ease-brand group-hover:scale-105"
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

        {showQuickAdd && !soldOut ? (
          <div className="absolute inset-x-4 bottom-4 opacity-0 transition-opacity duration-300 ease-brand group-hover:opacity-100">
            <QuickAddButton product={product} />
          </div>
        ) : null}
      </Tile>

      <div className="mt-4 space-y-1">
        <p className="text-sm">{product.name}</p>
        {showPrice ? (
          onSale ? (
            <p className="flex items-center gap-2 text-sm">
              <span className="text-muted line-through">
                {formatIDR(product.comparePrice ?? product.price)}
              </span>
              <span className="text-ink">{formatIDR(product.price)}</span>
            </p>
          ) : (
            <p className="text-sm text-muted">{formatIDR(product.price)}</p>
          )
        ) : null}
      </div>
    </Link>
  );
}
