import type {ComponentProps, ElementType} from "react";
import {cn} from "@/presentation/lib/cn";

type EyebrowProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & Omit<ComponentProps<T>, "as" | "className">;

/** Label kecil di atas headline — bagian 1.3 issue.md. */
export function Eyebrow<T extends ElementType = "p">({
  as,
  className,
  ...props
}: EyebrowProps<T>) {
  const Component = as ?? "p";
  return (
    <Component
      className={cn("text-eyebrow uppercase tracking-eyebrow text-muted", className)}
      {...props}
    />
  );
}
