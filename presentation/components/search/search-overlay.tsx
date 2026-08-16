"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import Link from "next/link";
import {Chip} from "@/presentation/components/ui/chip";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {useUi} from "@/presentation/providers/ui-provider";
import type {Product} from "@/domain/entities/product";

const POPULAR_TERMS = ["Sofa", "Lounge Chair", "Dining Table", "Solana Lounge Chair"];
const MAX_RESULTS = 6;
const AUTOFOCUS_DELAY_MS = 320;

export type SearchOverlayProps = {
  products: Product[];
  categoryNameBySlug: Record<string, string>;
  collectionNameBySlug: Record<string, string>;
};

/** Sheet pencarian turun dari atas — bagian 3.5 issue.md. */
export function SearchOverlay({
  products,
  categoryNameBySlug,
  collectionNameBySlug,
}: SearchOverlayProps) {
  const {isOpen, close} = useUi();
  const open = isOpen("search");
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClose() {
    close();
    setQuery("");
  }

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), AUTOFOCUS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        setQuery("");
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return products
      .filter((product) => {
        const categoryName = categoryNameBySlug[product.category] ?? product.category;
        const collectionName = collectionNameBySlug[product.collection] ?? product.collection;
        return (
          product.name.toLowerCase().includes(q) ||
          categoryName.toLowerCase().includes(q) ||
          collectionName.toLowerCase().includes(q)
        );
      })
      .slice(0, MAX_RESULTS);
  }, [query, products, categoryNameBySlug, collectionNameBySlug]);

  if (!open) return null;

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
            {query.trim() === "" ? (
              <div className="flex flex-wrap items-center gap-6">
                <span className="text-xs uppercase tracking-label text-muted">Popular</span>
                {POPULAR_TERMS.map((term) => (
                  <Chip key={term} onClick={() => setQuery(term)}>
                    {term}
                  </Chip>
                ))}
              </div>
            ) : results.length === 0 ? (
              <p className="text-sm text-muted">No pieces match &ldquo;{query}&rdquo;.</p>
            ) : (
              <ul className="divide-y divide-hairline">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/product/${product.id}`}
                      onClick={handleClose}
                      className="flex items-center gap-4 py-4"
                    >
                      <div className="size-16 shrink-0">
                        <PlaceholderImage label={product.name} />
                      </div>
                      <div>
                        <p className="text-sm">{product.name}</p>
                        <p className="text-xs text-muted">
                          {categoryNameBySlug[product.category] ?? product.category} ·{" "}
                          {collectionNameBySlug[product.collection] ?? product.collection}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
