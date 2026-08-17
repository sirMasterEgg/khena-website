import type {ComponentProps, ElementType} from "react";
import {cn} from "@/presentation/lib/cn";

type ContainerProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & Omit<ComponentProps<T>, "as" | "className">;

/** Lebar konten standar situs — bagian 1.4 issue.md. */
export function Container<T extends ElementType = "div">({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn("mx-auto w-full max-w-355 px-6", className)}
      {...props}
    />
  );
}
