"use client";

import {useEffect, useId, useRef, useState} from "react";
import type {KeyboardEvent} from "react";
import Link from "next/link";
import {cn} from "@/presentation/lib/cn";
import {Container} from "@/presentation/components/ui/container";
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
 * dropdown tanpa terputus. Dropdown-nya `fixed` selebar layar penuh dan
 * nempel persis di bawah navbar (top-20 = tinggi navbar 80px), bukan
 * menggantung di bawah trigger yang di-hover — tetap tertutup dalam elemen
 * pembungkus yang sama secara DOM supaya hover trigger→dropdown tidak putus.
 * Muncul dengan `animate-fade-down` (fade-in + geser turun tipis) dan
 * hilang dengan `animate-fade-out-up` (fade-out + geser naik tipis) —
 * dropdown tetap di-mount selama animasi keluar berjalan, baru dilepas dari
 * DOM setelah `onAnimationEnd`.
 */
export function MegaMenu(props: MegaMenuProps) {
  const {label, href, isActive} = props;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();

  function openMenu() {
    setMounted(true);
    setOpen(true);
  }

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // Jaring pengaman: lepas dropdown dari DOM setelah animasi keluar
  // selesai. Biasanya `onAnimationEnd` di bawah yang menangani ini lebih
  // dulu (lebih presisi) — timer ini cuma jaga-jaga kalau event itu tidak
  // pernah terpicu (mis. tab di-background saat animasi jalan).
  useEffect(() => {
    if (open) return;
    const timer = setTimeout(() => setMounted(false), 260);
    return () => clearTimeout(timer);
  }, [open]);

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
      openMenu();
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        openMenu();
      }}
      onMouseLeave={scheduleClose}
    >
      <Link
        href={href}
        aria-expanded={open}
        aria-controls={menuId}
        onKeyDown={handleTriggerKeyDown}
        onFocus={openMenu}
        className={cn(
          "text-sm uppercase tracking-button transition-colors duration-300 ease-brand",
          isActive ? "text-ink" : "text-muted hover:text-ink"
        )}
      >
        {label}
      </Link>

      {mounted ? (
        <div
          id={menuId}
          role="menu"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          onAnimationEnd={() => {
            if (!open) setMounted(false);
          }}
          className={cn(
            "fixed inset-x-0 top-20 z-50 border-b border-ink bg-cream shadow-lg",
            open ? "animate-fade-down" : "pointer-events-none animate-fade-out-up"
          )}
        >
          <Container className="py-10">
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
                            className="text-sm transition-colors duration-300 ease-brand hover:text-accent"
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
                    className="text-sm transition-colors duration-300 ease-brand hover:text-accent"
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
          </Container>
        </div>
      ) : null}
    </div>
  );
}
