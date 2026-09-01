"use client";

import {useState} from "react";
import Link from "next/link";
import {
  formatDimensionSet,
  getDefaultVariant,
  getVariantSavings,
  isVariantLowStock,
  isVariantOnSale,
  isVariantSoldOut,
  type ProductDetail,
} from "@/domain/entities/product-detail";
import type {ProductSummary} from "@/domain/entities/product-summary";
import {LifestyleSlider} from "@/presentation/components/product/lifestyle-slider";
import {ProductSummaryCard} from "@/presentation/components/product/product-summary-card";
import {Accordion} from "@/presentation/components/ui/accordion";
import {Button} from "@/presentation/components/ui/button";
import {Container} from "@/presentation/components/ui/container";
import {Eyebrow} from "@/presentation/components/ui/eyebrow";
import {RemoteImage} from "@/presentation/components/ui/remote-image";
import {formatIDR} from "@/presentation/lib/format";
import {cn} from "@/presentation/lib/cn";
import {useToast} from "@/presentation/providers/toast-provider";
import {useUi} from "@/presentation/providers/ui-provider";
import {useCart} from "@/presentation/providers/cart-provider";

export type ProductDetailViewProps = {
  product: ProductDetail;
  relatedProducts: ProductSummary[];
};

/** Halaman detail produk — galeri varian + info + aksi (issue #40). */
export function ProductDetailView({product, relatedProducts}: ProductDetailViewProps) {
  const [selectedSku, setSelectedSku] = useState(() => getDefaultVariant(product)?.sku);
  // Indeks foto di dalam `variant.images` yang sedang tampil — direset ke 0
  // setiap kali varian berganti (foto varian lain punya urutan sendiri).
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const {toast} = useToast();
  const {open: openOverlay} = useUi();
  const {addItem} = useCart();

  const variant =
    product.variants.find((item) => item.sku === selectedSku) ?? getDefaultVariant(product);
  const activeImage = variant?.images[activeImageIndex] ?? variant?.images[0];

  const soldOut = variant ? isVariantSoldOut(variant) : false;
  const lowStock = variant ? isVariantLowStock(variant) : false;
  const onSale = variant ? isVariantOnSale(variant) : false;
  const savings = variant ? getVariantSavings(variant) : 0;
  const hasColors = product.variants.some((item) => item.colorName);
  const dimensionsText = formatDimensionSet(product.dimensions.product);
  const boxText = formatDimensionSet(product.dimensions.box);

  function selectVariant(sku: string) {
    setSelectedSku(sku);
    setActiveImageIndex(0);
    // Stok varian baru bisa lebih kecil dari qty sekarang.
    setQty(1);
  }

  function handleAddToCart() {
    if (!variant) return;
    addItem(
      {
        productSku: product.sku,
        variantSku: variant.sku,
        name: product.name,
        image: variant.images[0],
        colorName: variant.colorName,
        colorHex: variant.colorHex,
        price: variant.price,
        priceAfterDiscount: variant.priceAfterDiscount,
        stock: variant.stock,
      },
      qty
    );
    toast(`${product.name} added to bag`);
  }

  function handleJoinWaitlist() {
    toast(`We'll let you know when ${product.name} is back in stock`);
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
        {/* Galeri varian */}
        <div>
          <div
            className="relative flex aspect-square items-center justify-center overflow-hidden transition-colors duration-500 ease-brand"
            style={{backgroundColor: "#F4EFEA"}}
          >
            <RemoteImage
              src={activeImage}
              alt={product.name}
              label={product.name}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />

            {variant?.colorName ? (
              <span className="absolute right-6 top-6 text-xs uppercase tracking-label text-ink-soft">
                {variant.colorName}
              </span>
            ) : null}

            {variant?.colorHex || variant?.colorName ? (
              <div className="absolute bottom-6 left-6 text-ink-soft">
                <p className="mt-1 flex items-center gap-2 text-xs">
                  <span
                    className="size-3 shrink-0"
                    style={{backgroundColor: variant?.colorHex ?? "#E4E2DD"}}
                    aria-hidden="true"
                  />
                  {variant?.colorName ? `${variant.colorName} · ` : ""}KHENA
                </p>
              </div>
            ) : null}
          </div>

          {variant && variant.images.length > 1 ? (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {variant.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  aria-label={`Lihat foto ${index + 1}`}
                  aria-pressed={index === activeImageIndex}
                  onClick={() => setActiveImageIndex(index)}
                  className={cn(
                    "relative aspect-square overflow-hidden border transition-colors duration-300 ease-brand",
                    index === activeImageIndex ? "border-ink" : "border-transparent"
                  )}
                >
                  <RemoteImage src={image} alt={product.name} label={product.name} />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Info */}
        <div>
          <Eyebrow>KHENA</Eyebrow>
          <h1 className="mt-2 font-display text-h2">{product.name}</h1>

          {variant ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {onSale ? (
                <>
                  <span className="text-muted line-through">{formatIDR(variant.price)}</span>
                  <span className="text-lg">{formatIDR(variant.priceAfterDiscount)}</span>
                  <span className="text-sm text-accent">Save {formatIDR(savings)}</span>
                </>
              ) : (
                <span className="text-lg">{formatIDR(variant.priceAfterDiscount)}</span>
              )}
            </div>
          ) : null}

          {variant ? (
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
                  ? `Only ${variant.stock} left — made to order`
                  : "In stock — made to order"}
            </div>
          ) : null}

          {product.description ? (
            <p className="mt-6 max-w-[56ch] text-base text-muted">{product.description}</p>
          ) : null}

          {hasColors ? (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-label text-muted">
                Color: {variant?.colorName ?? "—"}
              </p>
              <div className="mt-2 flex gap-3">
                {product.variants.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={item.colorName ?? item.sku}
                    aria-pressed={item.sku === variant?.sku}
                    onClick={() => selectVariant(item.sku)}
                    style={{backgroundColor: item.colorHex ?? "#E4E2DD"}}
                    className={cn(
                      "size-8 border-2 transition-colors duration-300 ease-brand",
                      item.sku === variant?.sku ? "border-ink" : "border-transparent"
                    )}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {variant ? (
            <div className="mt-8 space-y-3">
              {soldOut ? (
                <Button variant="dark" size="lg" className="w-full" onClick={handleJoinWaitlist}>
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
                        onClick={() => setQty((current) => Math.min(variant.stock, current + 1))}
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
          ) : (
            <p className="mt-8 text-sm text-muted">This piece is currently unavailable.</p>
          )}

          <p className="mt-6 text-xs text-muted">
            Pickup available at Indonesia Store
            <br />
            Usually ready in 24 hours
          </p>

          <div className="mt-10 border-t border-hairline">
            {product.materials || product.careInstructions.length > 0 ? (
              <Accordion title="Material & Care">
                {product.materials ? <p>{product.materials}</p> : null}
                {product.careInstructions.length > 0 ? (
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    {product.careInstructions.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                ) : null}
              </Accordion>
            ) : null}
            <Accordion title="Dimensions">
              {dimensionsText ? <p>{dimensionsText}</p> : null}
              {boxText ? <p className="mt-1">Box: {boxText}</p> : null}
              {product.dimensions.product?.weight !== undefined ? (
                <p className="mt-1">Weight: {product.dimensions.product.weight} kg</p>
              ) : null}
              <p className="mt-1">SKU: {variant?.sku ?? product.sku}</p>
              {product.dimensions.product?.image ? (
                <div className="relative mt-4 aspect-[4/3] overflow-hidden">
                  <RemoteImage
                    src={product.dimensions.product.image}
                    alt={`${product.name} dimensions`}
                    label={product.name}
                  />
                </div>
              ) : null}
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

      {product.media.length > 0 ? (
        <LifestyleSlider images={product.media} productName={product.name} />
      ) : null}

      {relatedProducts.length > 0 ? (
        <div className="py-20">
          <h2 className="font-display text-h3">Related Pieces</h2>
          <div className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductSummaryCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      ) : null}
    </Container>
  );
}
