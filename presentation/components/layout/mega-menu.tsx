"use client";

import {useEffect, useId, useRef, useState} from "react";
import type {KeyboardEvent} from "react";
import Link from "next/link";
import {cn} from "@/presentation/lib/cn";
import {TextLink} from "@/presentation/components/ui/text-link";
import type {Collection} from "@/domain/entities/collection";
import type {ShopMenuGroup} from "@/presentation/components/layout/nav-data";

const CLOSE_DELAY_MS = 160;

type SharedProps = {
  label: string;
  href: string;
  isActive: boolean;
};

export type MegaMenuProps =
  | (SharedProps & {variant: "shop"; shopGroups: ShopMenuGroup[]})
  | (SharedProps & {variant: "collection"; collections: Collection[]});

/**
 * Trigger + dropdown untuk SHOP/COLLECTION di navbar — bagian 3.1 issue.md.
 * Menutup dengan delay 160ms supaya kursor sempat pindah dari trigger ke
 * dropdown tanpa terputus.
 */
export function MegaMenu(props: MegaMenuProps) {
  const {label, href, isActive} = props;
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <Link
        href={href}
        aria-expanded={open}
        aria-controls={menuId}
        onKeyDown={handleTriggerKeyDown}
        onFocus={() => setOpen(true)}
        className={cn(
          "text-sm uppercase tracking-button transition-colors duration-300 ease-brand",
          isActive ? "text-ink" : "text-muted hover:text-ink"
        )}
      >
        {label}
      </Link>

      {open ? (
        <div
          id={menuId}
          role="menu"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          className="absolute left-1/2 top-full w-screen max-w-215 -translate-x-1/2 border border-ink bg-cream p-10 shadow-lg"
        >
          {props.variant === "shop" ? (
            <div className="grid grid-cols-3 gap-10">
              {props.shopGroups.map((group) => (
                <div key={group.room}>
                  <p className="mb-4 text-xs uppercase tracking-label text-muted">{group.label}</p>
                  <ul className="space-y-2">
                    {group.categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/shop?category=${category.slug}`}
                          className="text-sm hover:text-accent"
                          onClick={() => setOpen(false)}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="col-span-3 border-t border-hairline pt-4 text-right">
                <TextLink href="/shop" onClick={() => setOpen(false)}>
                  View All →
                </TextLink>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-10">
              {props.collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/shop?collection=${collection.slug}`}
                  className="text-sm hover:text-accent"
                  onClick={() => setOpen(false)}
                >
                  {collection.name}
                </Link>
              ))}
              <TextLink href="/collections" className="ml-auto" onClick={() => setOpen(false)}>
                View All →
              </TextLink>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
