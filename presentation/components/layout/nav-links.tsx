"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/presentation/lib/cn";
import {NAV_LINKS, type ShopMenuGroup} from "@/presentation/components/layout/nav-data";
import {MegaMenu} from "@/presentation/components/layout/mega-menu";
import type {Collection} from "@/domain/entities/collection";

export function NavLinks({
  shopGroups,
  collections,
}: {
  shopGroups: ShopMenuGroup[];
  collections: Collection[];
}) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center justify-center gap-10 md:flex">
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

        if (link.label === "SHOP") {
          return (
            <MegaMenu
              key={link.href}
              variant="shop"
              label={link.label}
              href={link.href}
              isActive={isActive}
              shopGroups={shopGroups}
            />
          );
        }

        if (link.label === "COLLECTION") {
          return (
            <MegaMenu
              key={link.href}
              variant="collection"
              label={link.label}
              href={link.href}
              isActive={isActive}
              collections={collections}
            />
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm uppercase tracking-button transition-colors duration-300 ease-brand",
              isActive ? "text-ink" : "text-muted hover:text-ink"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
