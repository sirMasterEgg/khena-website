"use client";

import {useEffect, useId, useState} from "react";
import type {ReactNode} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Drawer} from "@/presentation/components/ui/drawer";
import {TextLink} from "@/presentation/components/ui/text-link";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {cn} from "@/presentation/lib/cn";
import {NAV_LINKS, type ShopMenuGroup} from "@/presentation/components/layout/nav-data";
import {useUi} from "@/presentation/providers/ui-provider";
import type {Collection} from "@/domain/entities/collection";

/** Overlay full-screen di bawah `lg:` (termasuk tablet) — bagian 3.1 issue.md. */
export function MobileMenu({
  shopGroups,
  collections,
}: {
  shopGroups: ShopMenuGroup[];
  collections: Collection[];
}) {
  const {isOpen, close} = useUi();
  const open = isOpen("mobileMenu");
  const pathname = usePathname();

  // Menu otomatis tertutup saat route berubah.
  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer open={open} onClose={close} ariaLabel="Menu" variant="full">
      <div className="flex items-center justify-between border-b border-ink px-6 py-6">
        <span className="font-display text-2xl tracking-wordmark">KHENA</span>
        <button type="button" aria-label="Close menu" onClick={close}>
          <Icon icon={ICONS.close} className="size-6" />
        </button>
      </div>
      <nav className="flex flex-col px-6 py-10">
        {NAV_LINKS.map((link) => {
          if (link.label === "SHOP") {
            return (
              <NavAccordion key={link.href} title={link.label}>
                <div className="flex flex-col gap-6">
                  {shopGroups.map((group) => (
                    <div key={group.room}>
                      <p className="mb-3 text-xs uppercase tracking-label text-muted">{group.label}</p>
                      <ul className="space-y-3">
                        {group.categories.map((category) => (
                          <li key={category.id}>
                            <Link href={`/shop?category=${category.slug}`} className="text-sm">
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <TextLink href="/shop">View All →</TextLink>
                </div>
              </NavAccordion>
            );
          }

          if (link.label === "COLLECTION") {
            return (
              <NavAccordion key={link.href} title={link.label}>
                <div className="flex flex-col gap-3">
                  {collections.map((collection) => (
                    <Link
                      key={collection.id}
                      href={`/shop?collection=${collection.slug}`}
                      className="text-sm"
                    >
                      {collection.name}
                    </Link>
                  ))}
                  <TextLink href="/collections">View All →</TextLink>
                </div>
              </NavAccordion>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-hairline py-4 font-display text-3xl"
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </Drawer>
  );
}

/**
 * Section accordion untuk SHOP/COLLECTION di mobile menu — tap untuk
 * expand/collapse dengan animasi geser (bukan `<details>` native yang
 * buka/tutup instan tanpa transisi). Dibuat lokal (bukan pakai `<Accordion>`
 * bersama) supaya typografinya tetap konsisten dengan item nav lain
 * (`font-display text-3xl`).
 *
 * Animasinya pakai trik `grid-template-rows: 0fr -> 1fr` supaya bisa
 * transisi ke tinggi konten yang sebenarnya tanpa perlu ukur `scrollHeight`
 * lewat JS (dan otomatis menyesuaikan kalau kontennya berubah).
 */
function NavAccordion({title, children}: {title: string; children: ReactNode}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-b border-hairline">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 font-display text-3xl"
      >
        {title}
        <span
          aria-hidden="true"
          className={cn(
            "shrink-0 text-2xl transition-transform duration-300 ease-brand",
            open && "rotate-45"
          )}
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
          <div aria-hidden={!open} className="pb-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
