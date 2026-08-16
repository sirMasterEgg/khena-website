"use client";

import {useEffect} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Drawer} from "@/presentation/components/ui/drawer";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {NAV_LINKS} from "@/presentation/components/layout/nav-data";
import {useUi} from "@/presentation/providers/ui-provider";

/** Overlay full-screen di bawah `md:` — bagian 3.1 issue.md. */
export function MobileMenu() {
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
      <nav className="flex flex-col gap-2 px-6 py-10">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="border-b border-hairline py-4 font-display text-3xl"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </Drawer>
  );
}
