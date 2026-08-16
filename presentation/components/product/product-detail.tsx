"use client";

import {useState} from "react";
import Link from "next/link";
import {isOnSale, LOW_STOCK_THRESHOLD, type Product} from "@/domain/entities/product";
import {COLOR_SWATCHES, type ColorSwatchKey} from "@/domain/entities/color-swatch";
import {getSavingsAmount} from "@/domain/services/pricing";
import {getProductColorSwatches} from "@/presentation/components/product/color-swatches";
import {LifestyleSlider} from "@/presentation/components/product/lifestyle-slider";
import {ProductCard} from "@/presentation/components/product/product-card";
import {Accordion} from "@/presentation/components/ui/accordion";
import {Button} from "@/presentation/components/ui/button";
import {Container} from "@/presentation/components/ui/container";
import {Eyebrow} from "@/presentation/components/ui/eyebrow";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import {formatDimensions, formatIDR} from "@/presentation/lib/format";
import {cn} from "@/presentation/lib/cn";
import {useToast} from "@/presentation/providers/toast-provider";
import {useUi} from "@/presentation/providers/ui-provider";
import type {Collection} from "@/domain/entities/collection";

export type ProductDetailProps = {
  product: Product;
  collection?: Collection;
  relatedProducts: Product[];
};

/** Halaman detail produk — galeri Pantone + info + aksi (bagian 4.5 issue.md). */
export function ProductDetail({product, collection, relatedProducts}: ProductDetailProps) {
  const colorSwatches = getProductColorSwatches(product);
  const [selectedColor, setSelectedColor] = useState<ColorSwatchKey | undefined>(
    colorSwatches[0]?.key
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const {toast} = useToast();
  const {open: openOverlay} = useUi();

  const swatch = selectedColor ? COLOR_SWATCHES[selectedColor] : undefined;
  const cardBackground = swatch?.cardBackground ?? "#F4EFEA";
  const soldOut = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;
  const onSale = isOnSale(product);
  const savings = getSavingsAmount(product);
  const activeTag = product.images[activeImageIndex] ?? product.images[0];
  const collectionName = collection?.name ?? product.collection;

  function handleAddToCart() {
    // TODO(ISSUE-09): panggil CartProvider.addItem() sungguhan (id + color + qty).
    toast(`${product.name} added to bag`);
  }

  function handleMakeItYours() {
    handleAddToCart();
    openOverlay("cart");
  }

  return (
    <Container>
      <Link
        href="/shop"
        className="inline-block pt-8 text-xs uppercase tracking-label text-muted hover:text-ink"
      >
        ← Back
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-12 pb-20 lg:grid-cols-2 lg:gap-20">
        {/* Galeri Pantone */}
        <div>
          <div
            className="relative flex aspect-square items-center justify-center overflow-hidden transition-colors duration-500 ease-brand"
            style={{backgroundColor: cardBackground}}
          >
            <span className="absolute right-6 top-6 text-xs uppercase tracking-label text-ink-soft">
              {activeTag}
            </span>

            <div className="size-70 drop-shadow-xl">
              <PlaceholderImage label={product.name} />
            </div>

            {swatch ? (
              <div className="absolute bottom-6 left-6 text-ink-soft">
                <p className="text-sm uppercase tracking-label">{swatch.label}</p>
                <p className="mt-1 flex items-center gap-2 text-xs">
                  <span
                    className="size-3 shrink-0"
                    style={{backgroundColor: swatch.chipColor}}
                    aria-hidden="true"
                  />
                  KHENA · {collectionName.toUpperCase()}
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-4 gap-4">
            {product.images.map((tag, index) => (
              <button
                key={tag}
                type="button"
                aria-label={`Lihat gambar ${tag}`}
                aria-pressed={index === activeImageIndex}
                onClick={() => setActiveImageIndex(index)}
                style={{backgroundColor: cardBackground}}
                className={cn(
                  "flex aspect-square items-center justify-center border text-[10px] uppercase text-ink-soft transition-colors duration-300 ease-brand",
                  index === activeImageIndex ? "border-ink" : "border-transparent"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <Eyebrow>{collectionName}</Eyebrow>
          <h1 className="mt-2 font-display text-h2">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {onSale ? (
              <>
                <span className="text-muted line-through">
                  {formatIDR(product.comparePrice ?? product.price)}
                </span>
                <span className="text-lg">{formatIDR(product.price)}</span>
                <span className="text-sm text-accent">Save {formatIDR(savings)}</span>
              </>
            ) : (
              <span className="text-lg">{formatIDR(product.price)}</span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span
              className={cn(
                "size-2 rounded-full",
                soldOut ? "bg-danger" : lowStock ? "bg-accent" : "bg-ink"
              )}
              aria-hidden="true"
            />
            {soldOut
              ? "Sold out — join the waitlist below"
              : lowStock
                ? `Only ${product.stock} left — made to order`
                : "In stock — made to order"}
          </div>

          <p className="mt-6 max-w-[56ch] text-base text-muted">{product.description}</p>

          {colorSwatches.length > 0 ? (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-label text-muted">
                Color: {swatch?.label}
              </p>
              <div className="mt-2 flex gap-3">
                {colorSwatches.map((colorSwatch) => (
                  <button
                    key={colorSwatch.key}
                    type="button"
                    aria-label={colorSwatch.label}
                    aria-pressed={selectedColor === colorSwatch.key}
                    onClick={() => setSelectedColor(colorSwatch.key)}
                    style={{backgroundColor: colorSwatch.chipColor}}
                    className={cn(
                      "size-8 border-2 transition-colors duration-300 ease-brand",
                      selectedColor === colorSwatch.key ? "border-ink" : "border-transparent"
                    )}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 space-y-3">
            {soldOut ? (
              <Button variant="dark" size="lg" className="w-full" onClick={handleAddToCart}>
                Join the Waitlist
              </Button>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-ink">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      className="px-4 py-3"
                      onClick={() => setQty((current) => Math.max(1, current - 1))}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      className="px-4 py-3"
                      onClick={() => setQty((current) => Math.min(product.stock, current + 1))}
                    >
                      +
                    </button>
                  </div>
                  <Button className="flex-1" onClick={handleAddToCart}>
                    Add to Cart
                  </Button>
                </div>
                <Button variant="dark" size="lg" className="w-full" onClick={handleMakeItYours}>
                  Make It Yours
                </Button>
              </>
            )}
          </div>

          <p className="mt-6 text-xs text-muted">
            Pickup available at Indonesia Store
            <br />
            Usually ready in 24 hours
          </p>

          <div className="mt-10 border-t border-hairline">
            <Accordion title="Material & Care">
              <p>{product.material}</p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                {product.care.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Dimensions">
              <p>{formatDimensions(product.dimensions)}</p>
              <p className="mt-1">SKU: {product.sku}</p>
            </Accordion>
            <Accordion title="Shipping & Delivery">
              <p>
                Delivered by white-glove courier — see our{" "}
                <Link href="/info/shipping" className="underline">
                  shipping policy
                </Link>{" "}
                for details.
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {product.lifestyle && product.lifestyle.length > 0 ? (
        <LifestyleSlider captions={product.lifestyle} productName={product.name} />
      ) : null}

      {relatedProducts.length > 0 ? (
        <div className="py-20">
          <h2 className="font-display text-h3">Related Pieces</h2>
          <div className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      ) : null}
    </Container>
  );
}
