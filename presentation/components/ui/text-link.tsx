import Link from "next/link";
import type {ComponentProps} from "react";
import {cn} from "@/presentation/lib/cn";

const BASE =
  "relative inline-block text-xs uppercase tracking-label after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-[width] after:duration-500 after:ease-brand after:content-[''] hover:after:w-full";

type SharedProps = {className?: string};

type TextLinkAsButton = SharedProps &
  Omit<ComponentProps<"button">, keyof SharedProps> & {href?: undefined};

type TextLinkAsLink = SharedProps &
  Omit<ComponentProps<typeof Link>, keyof SharedProps> & {
    href: ComponentProps<typeof Link>["href"];
  };

export type TextLinkProps = TextLinkAsButton | TextLinkAsLink;

/** Teks uppercase dengan underline yang tumbuh saat hover — bagian 1.7 issue.md. */
export function TextLink({className, ...props}: TextLinkProps) {
  const classes = cn(BASE, className);

  if (props.href !== undefined) {
    const {href, ...rest} = props as TextLinkAsLink;
    return <Link href={href} className={classes} {...rest} />;
  }

  const {type = "button", ...rest} = props as TextLinkAsButton;
  return <button type={type} className={classes} {...rest} />;
}
