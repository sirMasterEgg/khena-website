"use client";

import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import type {ReactNode} from "react";
import {useAuth} from "@/presentation/providers/auth-provider";

type WishlistContextValue = {
  productIds: string[];
  isSaved: (productId: string) => boolean;
  toggle: (productId: string) => "saved" | "removed";
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function storageKey(userId: string) {
  return `khena.wishlist.${userId}`;
}

/** Wishlist per pengguna, disimpan lokal sampai backend siap (ISSUE-15). */
export function WishlistProvider({children}: {children: ReactNode}) {
  const {user, isHydrated: authHydrated} = useAuth();
  const [productIds, setProductIds] = useState<string[]>([]);

  useEffect(() => {
    if (!authHydrated) return;
    queueMicrotask(() => {
      if (!user) {
        setProductIds([]);
        return;
      }
      try {
        const raw = window.localStorage.getItem(storageKey(user.id));
        setProductIds(raw ? (JSON.parse(raw) as string[]) : []);
      } catch {
        setProductIds([]);
      }
    });
  }, [user, authHydrated]);

  useEffect(() => {
    if (!authHydrated || !user) return;
    window.localStorage.setItem(storageKey(user.id), JSON.stringify(productIds));
  }, [productIds, user, authHydrated]);

  const isSaved = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds]
  );

  const toggle = useCallback((productId: string): "saved" | "removed" => {
    let outcome: "saved" | "removed" = "saved";
    setProductIds((prev) => {
      if (prev.includes(productId)) {
        outcome = "removed";
        return prev.filter((id) => id !== productId);
      }
      outcome = "saved";
      return [...prev, productId];
    });
    return outcome;
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({productIds, isSaved, toggle}),
    [productIds, isSaved, toggle]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist harus dipakai di dalam <WishlistProvider>");
  return ctx;
}
