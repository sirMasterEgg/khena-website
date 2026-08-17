import Link from "next/link";
import {NavLinks} from "@/presentation/components/layout/nav-links";
import {NavbarActions} from "@/presentation/components/layout/navbar-actions";
import type {ShopMenuGroup} from "@/presentation/components/layout/nav-data";
import type {Collection} from "@/domain/entities/collection";

/** Navbar sticky 80px dengan mega dropdown — bagian 3.1 issue.md. */
export function Navbar({
  shopGroups,
  collections,
}: {
  shopGroups: ShopMenuGroup[];
  collections: Collection[];
}) {
  return (
    <header className="sticky top-0 z-60 border-b border-ink bg-cream">
      <div className="grid h-20 grid-cols-[200px_1fr_auto] items-center px-6">
        <Link href="/" className="font-display text-3xl tracking-wordmark">
          KHENA
        </Link>
        <NavLinks shopGroups={shopGroups} collections={collections} />
        <NavbarActions />
      </div>
    </header>
  );
}
