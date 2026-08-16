"use client";

import {useEffect, useRef} from "react";
import {createPortal} from "react-dom";
import type {ReactNode} from "react";
import {cn} from "@/presentation/lib/cn";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  /** `right` untuk cart/account (slide dari kanan), `full` untuk menu mobile. */
  variant?: "right" | "full";
};

/**
 * Drawer bersama untuk Cart, Account, dan Mobile Menu — bagian 3.6 issue.md.
 * Menangani overlay, animasi slide, lock scroll body, Escape, focus trap, dan
 * pengembalian fokus ke elemen pemicu saat ditutup.
 */
export function Drawer({
  open,
  onClose,
  ariaLabel,
  children,
  className,
  variant = "right",
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  // Lock scroll body + kembalikan fokus ke pemicu saat ditutup.
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      document.body.style.overflow = "hidden";
    } else if (triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Fokus panel saat terbuka.
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  // Escape untuk menutup + focus trap Tab/Shift+Tab.
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-60">
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        className="absolute inset-0 animate-fade-in bg-ink/45"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={cn(
          "absolute inset-y-0 right-0 flex h-full w-full flex-col bg-cream outline-none",
          variant === "right"
            ? "max-w-115 animate-drawer-in-right"
            : "animate-drawer-in-right",
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
