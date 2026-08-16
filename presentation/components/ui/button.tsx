import Link from "next/link";
import type {ComponentProps} from "react";
import {cn} from "@/presentation/lib/cn";

export type ButtonVariant = "default" | "dark" | "light";
export type ButtonSize = "md" | "lg";

const BASE =
  "inline-flex items-center justify-center border border-ink px-7 py-3.5 font-sans text-sm font-bold tracking-button uppercase transition-colors duration-300 ease-brand disabled:cursor-not-allowed disabled:opacity-40";

const VARIANTS: Record<ButtonVariant, string> = {
  default: "bg-transparent text-ink hover:bg-ink hover:text-cream",
  dark: "bg-ink text-cream hover:bg-transparent hover:text-ink",
  light: "border-invert text-invert hover:bg-invert hover:text-ink",
};

const SIZES: Record<ButtonSize, string> = {
  md: "",
  lg: "px-10 py-4 text-base",
};

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type ButtonAsButton = SharedProps &
  Omit<ComponentProps<"button">, keyof SharedProps> & {
    href?: undefined;
  };

type ButtonAsLink = SharedProps &
  Omit<ComponentProps<typeof Link>, keyof SharedProps> & {
    href: ComponentProps<typeof Link>["href"];
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Tombol dasar situs — lihat bagian 1.7 issue.md. Merender <Link> kalau diberi
 * `href`, kalau tidak merender <button> (default type="button" supaya tidak
 * tersubmit form secara tidak sengaja).
 */
export function Button({
  variant = "default",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  if (props.href !== undefined) {
    const {href, ...rest} = props as ButtonAsLink;
    return <Link href={href} className={classes} {...rest} />;
  }

  const {type = "button", ...rest} = props as ButtonAsButton;
  return <button type={type} className={classes} {...rest} />;
}
