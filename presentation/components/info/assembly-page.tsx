"use client";

import {useMemo, useState} from "react";
import {InfoHero} from "@/presentation/components/info/info-hero";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {useToast} from "@/presentation/providers/toast-provider";
import {ASSEMBLY_MANUALS} from "@/infrastructure/mock/data/info-pages";

/** Halaman /info/assembly — search-first, bagian 4.9 issue.md. */
export function AssemblyPage() {
  const [query, setQuery] = useState("");
  const {toast} = useToast();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ASSEMBLY_MANUALS;
    return ASSEMBLY_MANUALS.filter(
      (manual) =>
        manual.productName.toLowerCase().includes(q) || manual.sku.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <>
      <InfoHero eyebrow="Information" title="Assembly Manuals" />

      <div className="mx-auto w-full max-w-180 px-6 py-20 lg:py-30">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by product or SKU..."
          className="h-16 w-full border border-ink px-6 font-display text-lg outline-none"
        />

        <ul className="mt-10 divide-y divide-hairline">
          {results.map((manual) => (
            <li key={manual.id} className="flex items-center justify-between gap-4 py-5">
              <div className="flex items-center gap-4">
                <Icon icon={ICONS.document} className="size-5 shrink-0 text-muted" />
                <div>
                  <p className="text-sm">{manual.productName}</p>
                  <p className="text-xs text-muted">{manual.fileName ?? manual.sku}</p>
                </div>
              </div>
              {manual.fileName ? (
                // Belum ada aset PDF sungguhan — placeholder path (bagian 0.3.5 issue.md).
                <a
                  href={`/manuals/${manual.fileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs uppercase tracking-label transition-colors duration-300 ease-brand hover:text-accent"
                >
                  Open PDF
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => toast(`${manual.productName} manual is not available yet`)}
                  className="shrink-0 text-xs uppercase tracking-label text-faint"
                >
                  —
                </button>
              )}
            </li>
          ))}
        </ul>

        {results.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted">No manuals match this search.</p>
        ) : null}
      </div>
    </>
  );
}
