"use client";

import {useMemo, useState} from "react";
import {InfoHero} from "@/presentation/components/info/info-hero";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {ASSEMBLY_HEADER} from "@/presentation/lib/info-fallback";
import type {AssemblyManual} from "@/domain/entities/info-content";

/** Halaman /info/assembly — search-first, bagian 4.9 issue.md + issue #27. */
export function AssemblyPage({manuals}: {manuals: AssemblyManual[]}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return manuals;
    return manuals.filter(
      (manual) =>
        manual.productName.toLowerCase().includes(q) ||
        manual.productSku.toLowerCase().includes(q) ||
        manual.fileName.toLowerCase().includes(q)
    );
  }, [manuals, query]);

  return (
    <>
      <InfoHero eyebrow={ASSEMBLY_HEADER.eyebrow} title={ASSEMBLY_HEADER.title} />

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
                  <p className="text-xs text-muted">
                    {manual.fileName} · {manual.fileSize}
                    {manual.productSku ? ` · ${manual.productSku}` : ""}
                  </p>
                </div>
              </div>
              <a
                href={manual.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs uppercase tracking-label transition-colors duration-300 ease-brand hover:text-accent"
              >
                Open PDF
              </a>
            </li>
          ))}
        </ul>

        {manuals.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted">No manuals available yet.</p>
        ) : results.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted">No manuals match this search.</p>
        ) : null}
      </div>
    </>
  );
}
