"use client";

import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {useQuery, keepPreviousData} from "@tanstack/react-query";
import {Chip} from "@/presentation/components/ui/chip";
import {RemoteImage} from "@/presentation/components/ui/remote-image";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {useUi} from "@/presentation/providers/ui-provider";
import {productSearchRepository} from "@/infrastructure/repositories/client";
import {isProductSummaryOnSale, isProductSummarySoldOut} from "@/domain/entities/product-summary";
import {formatIDR} from "@/presentation/lib/format";

const POPULAR_TERMS = ["Sofa", "Lounge Chair", "Dining Table", "Solana Lounge Chair"];
const AUTOFOCUS_DELAY_MS = 320;
/** User berhenti mengetik selama ini sebelum request dikirim — bagian fitur search product. */
const DEBOUNCE_MS = 300;

/**
 * Sheet pencarian turun dari atas — bagian 3.5 issue.md, disambungkan ke
 * `GET /api/products?search=` (contract.md Bagian 33 — fitur search
 * product). Sengaja tidak lagi menerima daftar produk lewat props seperti
 * sebelumnya: pencarian-saat-mengetik adalah interaksi browser murni, jadi
 * repository-nya dipanggil langsung dari sini lewat `apiClient`
 * (`HttpProductSearchRepository`), bukan lewat props dari Server Component.
 *
 * `productSummary` (bentuk hasil API, lihat `domain/entities/product-summary.ts`)
 * tidak membawa slug kategori/koleksi seperti entity `Product` mock — jadi
 * subtitle di bawah nama produk sekarang menampilkan harga, bukan
 * "Kategori · Koleksi" seperti versi mock.
 *
 * Konsekuensi yang diterima (sama pola dengan issue navbar #29 soal /shop):
 * `/product/[id]` masih 100% mock, sedangkan id hasil pencarian ini adalah
 * UUID asli dari backend — klik hasil pencarian kemungkinan besar mengarah
 * ke halaman produk kosong sampai `/product/[id]` ikut dimigrasikan di issue
 * terpisah.
 */
export function SearchOverlay() {
  const {isOpen, close} = useUi();
  const open = isOpen("search");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClose() {
    close();
    setQuery("");
    setDebouncedQuery("");
  }

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), AUTOFOCUS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Debounce: request baru hanya dikirim 300ms setelah user berhenti
  // mengetik, supaya tidak ada satu request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const {
    data: results,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["product-search", debouncedQuery],
    queryFn: ({signal}) => productSearchRepository.search(debouncedQuery, signal),
    enabled: debouncedQuery !== "",
    // Tetap tampilkan hasil lama saat mengetik lanjutan supaya list tidak
    // berkedip kosong sebelum jawaban baru datang.
    placeholderData: keepPreviousData,
  });

  if (!open) return null;

  const hasQuery = debouncedQuery !== "";

  return (
    <div className="fixed inset-0 z-60">
      <button
        type="button"
        aria-label="Close search"
        tabIndex={-1}
        className="absolute inset-0 animate-fade-in bg-ink/45"
        onClick={handleClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="absolute inset-x-0 top-0 max-h-[88vh] animate-drawer-in-top overflow-y-auto border-b border-ink bg-cream"
      >
        <div className="mx-auto max-w-215 px-6 py-14">
          <div className="flex items-center gap-4 border-b border-ink pb-4">
            <Icon icon={ICONS.search} className="size-5 text-muted" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pieces..."
              className="w-full border-0 bg-transparent font-display text-3xl outline-none"
            />
            <button type="button" aria-label="Close search" onClick={handleClose}>
              <Icon icon={ICONS.close} className="size-6" />
            </button>
          </div>

          <div className="mt-8">
            {!hasQuery ? (
              <div className="flex flex-wrap items-baseline gap-6">
                {/* `items-baseline` (bukan `items-center`) supaya teks "Popular"
                    sejajar dengan teks Chip — Chip punya `pb-1 border-b-2`
                    ekstra di bawah yang bikin box-nya lebih tinggi, jadi
                    `items-center` menggeser baseline teksnya. */}
                <span className="text-xs uppercase tracking-label text-muted">Popular</span>
                {POPULAR_TERMS.map((term) => (
                  <Chip key={term} onClick={() => setQuery(term)}>
                    {term}
                  </Chip>
                ))}
              </div>
            ) : isError ? (
              <p className="text-sm text-muted">Search is unavailable right now. Try again shortly.</p>
            ) : results && results.length > 0 ? (
              <ul className="divide-y divide-hairline">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/product/${product.id}`}
                      onClick={handleClose}
                      className="flex items-center gap-4 py-4"
                    >
                      <div className="relative size-16 shrink-0 overflow-hidden">
                        <RemoteImage src={product.image} alt={product.name} label={product.name} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{product.name}</p>
                        <p className="text-xs text-muted">
                          {isProductSummarySoldOut(product) ? (
                            "Sold Out"
                          ) : isProductSummaryOnSale(product) ? (
                            <>
                              <span className="text-accent">{formatIDR(product.priceAfterDiscount)}</span>{" "}
                              <span className="line-through">{formatIDR(product.price)}</span>
                            </>
                          ) : (
                            formatIDR(product.price)
                          )}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : isFetching ? (
              <p className="text-sm text-muted">Searching…</p>
            ) : (
              <p className="text-sm text-muted">No pieces match &ldquo;{debouncedQuery}&rdquo;.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
