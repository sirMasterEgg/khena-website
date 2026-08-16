import type {ComponentProps, ReactNode} from "react";
import {cn} from "@/presentation/lib/cn";

export type AccordionProps = {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
} & Omit<ComponentProps<"details">, "className" | "open" | "children">;

/**
 * Accordion native `<details>`/`<summary>` — bagian 1.7 issue.md. Untuk kasus
 * "hanya satu boleh terbuka" (mis. /info/care), buat komponen terkontrol
 * terpisah alih-alih memaksakan pola ini.
 */
export function Accordion({
  title,
  children,
  defaultOpen,
  className,
  ...props
}: AccordionProps) {
  return (
    <details
      open={defaultOpen}
      className={cn("group border-b border-hairline", className)}
      {...props}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm uppercase tracking-label">
        {title}
        <span
          aria-hidden="true"
          className="shrink-0 transition-transform duration-300 ease-brand group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="pb-5 text-sm text-muted">{children}</div>
    </details>
  );
}
