"use client";

import {useId, useState} from "react";
import type {ReactNode} from "react";
import {cn} from "@/presentation/lib/cn";

export type AccordionProps = {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

/**
 * Accordion dengan animasi expand/collapse — bagian 1.7 issue.md. Pakai
 * tombol terkontrol + trik CSS `grid-template-rows: 0fr -> 1fr` (bukan
 * `<details>`/`<summary>` native yang buka/tutup instan tanpa transisi)
 * supaya bisa animasi ke tinggi konten sebenarnya tanpa perlu ukur
 * `scrollHeight` lewat JS. Untuk kasus "hanya satu boleh terbuka" (mis.
 * /info/care), buat komponen terkontrol terpisah alih-alih memaksakan pola
 * ini.
 */
export function Accordion({title, children, defaultOpen = false, className}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={cn("border-b border-hairline", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left text-sm uppercase tracking-label"
      >
        {title}
        <span
          aria-hidden="true"
          className={cn("shrink-0 transition-transform duration-300 ease-brand", open && "rotate-45")}
        >
          +
        </span>
      </button>
      <div
        id={panelId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-brand",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div aria-hidden={!open} className="pb-5 text-sm text-muted">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
