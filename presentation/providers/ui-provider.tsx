"use client";

import {createContext, useCallback, useContext, useMemo, useState} from "react";
import type {ReactNode} from "react";

export type OverlayKey = "cart" | "account" | "search" | "mobileMenu";

type UiContextValue = {
  openOverlay: OverlayKey | null;
  isOpen: (key: OverlayKey) => boolean;
  open: (key: OverlayKey) => void;
  close: () => void;
  toggle: (key: OverlayKey) => void;
};

const UiContext = createContext<UiContextValue | null>(null);

/**
 * State overlay global (cart/account/search/mobile menu) — bagian 2.7 issue.md.
 * Hanya satu overlay yang bisa terbuka pada satu waktu.
 */
export function UiProvider({children}: {children: ReactNode}) {
  const [openOverlay, setOpenOverlay] = useState<OverlayKey | null>(null);

  const open = useCallback((key: OverlayKey) => setOpenOverlay(key), []);
  const close = useCallback(() => setOpenOverlay(null), []);
  const toggle = useCallback((key: OverlayKey) => {
    setOpenOverlay((current) => (current === key ? null : key));
  }, []);

  const value = useMemo<UiContextValue>(
    () => ({
      openOverlay,
      isOpen: (key: OverlayKey) => openOverlay === key,
      open,
      close,
      toggle,
    }),
    [openOverlay, open, close, toggle]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi harus dipakai di dalam <UiProvider>");
  return ctx;
}
