"use client";

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import type {ChangeEvent} from "react";
import {Chip} from "@/presentation/components/ui/chip";
import {SHOP_SORT_OPTIONS, type ShopSortMode} from "@/domain/services/product-sort";
import type {CatalogCategory, CatalogCollection} from "@/domain/entities/catalog";

export type ShopFilterBarProps = {
  categories: CatalogCategory[];
  activeCategorySlug?: string;
  activeCollection?: CatalogCollection;
  sortMode: ShopSortMode;
};

/**
 * Filter kategori + sort untuk `/shop` — bagian 4.4 issue.md, disambungkan ke
 * katalog backend di issue #32. Perubahan filter selalu lewat `router.push()`
 * ke query param baru, bukan `useState`, supaya bisa di-bookmark dan
 * di-share.
 */
export function ShopFilterBar({
  categories,
  activeCategorySlug,
  activeCollection,
  sortMode,
}: ShopFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function pushParams(mutate: (params: URLSearchParams) => void) {
    const next = new URLSearchParams(searchParams.toString());
    mutate(next);
    // WAJIB: setiap perubahan filter/sort menghapus `page` — kalau tidak,
    // user yang sedang di halaman 3 lalu mengganti filter akan mendarat di
    // halaman 3 hasil baru yang kemungkinan besar kosong (Tahap 7.1 issue #32).
    next.delete("page");
    const query = next.toString();
    // `scroll: false` — router.push() scroll ke atas <html> secara default
    // (docs use-router.md, bagian "Disabling scroll to top"). Tanpa ini,
    // tiap ganti kategori/sort melempar user ke atas hero, menjauhkannya
    // dari filter bar yang baru saja dia sentuh.
    router.push(query ? `${pathname}?${query}` : pathname, {scroll: false});
  }

  function handleCategoryClick(slug: string) {
    pushParams((params) => {
      if (params.get("category") === slug) {
        params.delete("category");
      } else {
        params.set("category", slug);
      }
    });
  }

  function clearCollection() {
    pushParams((params) => params.delete("collection"));
  }

  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    pushParams((params) => {
      if (event.target.value === "featured") {
        params.delete("sort");
      } else {
        params.set("sort", event.target.value);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4 border-b border-hairline p-7 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-6">
        {activeCollection ? (
          <Chip active onClick={clearCollection}>
            {activeCollection.name} ✕
          </Chip>
        ) : (
          categories.map((category) => (
            <Chip
              key={category.id}
              active={activeCategorySlug === category.slug}
              onClick={() => handleCategoryClick(category.slug)}
            >
              {category.name}
            </Chip>
          ))
        )}
      </div>

      <label className="flex items-center gap-2 text-xs uppercase tracking-label text-muted">
        Sort
        <select
          value={sortMode}
          onChange={handleSortChange}
          className="border-0 border-b border-ink bg-transparent py-1 text-ink outline-none"
        >
          {SHOP_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
