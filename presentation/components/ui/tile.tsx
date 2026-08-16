import type {ComponentProps} from "react";
import {cn} from "@/presentation/lib/cn";

/**
 * Wadah gambar dengan efek scale saat hover — bagian 1.7 issue.md. Beri
 * `group` di sini, dan `transition-transform duration-1200 ease-brand
 * group-hover:scale-105` ke anak (gambar/PlaceholderImage) di dalamnya.
 */
export function Tile({className, ...props}: ComponentProps<"div">) {
  return (
    <div className={cn("group relative overflow-hidden", className)} {...props} />
  );
}
