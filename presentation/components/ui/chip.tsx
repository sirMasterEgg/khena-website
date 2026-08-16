import type {ComponentProps} from "react";
import {cn} from "@/presentation/lib/cn";

export type ChipProps = {
  active?: boolean;
} & Omit<ComponentProps<"button">, "className"> & {className?: string};

/** Filter chip (bukan pill) — bagian 1.7 issue.md. */
export function Chip({active, className, type = "button", ...props}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        "border-b-2 pb-1 text-xs uppercase tracking-label transition-colors duration-300 ease-brand",
        active ? "border-ink text-ink" : "border-transparent text-muted",
        className
      )}
      {...props}
    />
  );
}
