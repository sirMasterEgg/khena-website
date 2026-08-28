import Link from "next/link";
import type {PageMeta} from "@/domain/entities/pagination";
import {cn} from "@/presentation/lib/cn";

export type ShopPaginationProps = {
  meta: PageMeta;
  /** `searchParams` halaman yang sudah di-`await` — dipakai membangun href Prev/Next. */
  searchParams: {[key: string]: string | string[] | undefined};
  pathname?: string;
};

const NAV_CLASSES = "text-xs uppercase tracking-label";

/**
 * Prev/Next + "Page X of Y" untuk `/shop` (Pertanyaan Terbuka #3, default
 * Prev/Next dipakai — issue #32). Server Component: href dibangun dengan
 * menyalin query yang ada lalu menimpa `page`, tidak butuh state client.
 */
export function ShopPagination({meta, searchParams, pathname = "/shop"}: ShopPaginationProps) {
  if (meta.totalPages <= 1) return null;

  const page = meta.page;
  const hasPrev = page > 1;
  const hasNext = page < meta.totalPages;

  function hrefForPage(target: number): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined) continue;
      if (Array.isArray(value)) {
        for (const v of value) params.append(key, v);
      } else {
        params.set(key, value);
      }
    }
    params.set("page", String(target));
    return `${pathname}?${params.toString()}`;
  }

  return (
    <nav className="mt-15 flex items-center justify-center gap-6" aria-label="Pagination">
      {hasPrev ? (
        <Link href={hrefForPage(page - 1)} className={NAV_CLASSES}>
          Prev
        </Link>
      ) : (
        <span className={cn(NAV_CLASSES, "text-muted")}>Prev</span>
      )}

      <span className="text-xs uppercase tracking-label text-muted">
        Page {page} of {meta.totalPages}
      </span>

      {hasNext ? (
        <Link href={hrefForPage(page + 1)} className={NAV_CLASSES}>
          Next
        </Link>
      ) : (
        <span className={cn(NAV_CLASSES, "text-muted")}>Next</span>
      )}
    </nav>
  );
}
