"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import type {ProductSummary} from "@/domain/entities/product-summary";
import type {PageMeta} from "@/domain/entities/pagination";
import type {ProductCatalogQuery} from "@/domain/repositories/product-catalog-repository";
import {sortSummariesSoldOutLast} from "@/domain/services/product-sort";
import {ProductSummaryCard} from "@/presentation/components/product/product-summary-card";
import {Reveal} from "@/presentation/components/motion/reveal";
import {productCatalogClientRepository} from "@/infrastructure/repositories/client";

export type ShopProductGridProps = {
  /** Halaman pertama, sudah dirender di server (page.tsx). */
  initialItems: ProductSummary[];
  initialMeta: PageMeta;
  /** Filter/sort yang sedang aktif, tanpa `page` — dipakai untuk mengambil halaman berikutnya. */
  query: Omit<ProductCatalogQuery, "page">;
};

type LoadStatus = "idle" | "loading" | "error";

/** Sama dengan default backend (`limit` `/api/products`) — dipakai untuk mengulang pola stagger tiap batch baru. */
const PAGE_SIZE = 12;

/**
 * Grid produk `/shop` dengan infinite scroll. Batch pertama datang lewat
 * props dari Server Component; batch berikutnya diambil di browser lewat
 * `productCatalogClientRepository` (transport `apiClient`, bukan
 * `serverFetch` — komponen ini `"use client"`) saat sentinel di bawah grid
 * masuk viewport.
 *
 * Komponen ini di-`key`-kan oleh pemanggil (`app/shop/page.tsx`) berdasarkan
 * `query` — begitu filter/sort berubah, React me-remount dari nol alih-alih
 * mencampur state lama dengan hasil query baru.
 */
export function ShopProductGrid({initialItems, initialMeta, query}: ShopProductGridProps) {
  const [items, setItems] = useState(initialItems);
  const [meta, setMeta] = useState(initialMeta);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = meta.page < meta.totalPages;

  const loadMore = useCallback(async () => {
    setStatus("loading");
    try {
      const nextPage = await productCatalogClientRepository.list({...query, page: meta.page + 1});
      // Sold-out dipindah ke akhir HANYA di dalam batch yang baru datang (D4,
      // issue #32) — supaya kartu yang sudah tampil tidak melompat posisi
      // tiap kali batch baru masuk.
      setItems((prev) => [...prev, ...sortSummariesSoldOutLast(nextPage.items)]);
      setMeta(nextPage.meta);
      setStatus("idle");
    } catch (error) {
      console.error("[shop] gagal memuat produk berikutnya", error);
      setStatus("error");
    }
  }, [meta.page, query]);

  useEffect(() => {
    const el = sentinelRef.current;
    // Berhenti mengamati saat sedang loading atau gagal — kalau tidak,
    // sentinel yang masih terlihat akan memicu `loadMore()` berulang-ulang
    // tanpa jeda. Retry setelah gagal dilakukan manual lewat tombol di bawah.
    if (!el || !hasMore || status !== "idle") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      {rootMargin: "600px 0px"}
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, status, loadMore]);

  return (
    <>
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product, index) => (
          <Reveal key={product.id} delayMs={(index % PAGE_SIZE) * 100}>
            <ProductSummaryCard product={product} showPrice={false} />
          </Reveal>
        ))}
      </div>

      {hasMore ? (
        <div ref={sentinelRef} className="mt-15 flex justify-center">
          {status === "error" ? (
            <button
              type="button"
              onClick={loadMore}
              className="text-xs uppercase tracking-label text-muted underline underline-offset-4"
            >
              Failed to load more pieces — tap to retry
            </button>
          ) : (
            <p className="text-xs uppercase tracking-label text-muted">Loading more pieces…</p>
          )}
        </div>
      ) : null}
    </>
  );
}
