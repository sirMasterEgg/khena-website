"use client";

import {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import type {ReactNode} from "react";
import {useAuth} from "@/presentation/providers/auth-provider";

type WishlistContextValue = {
  productIds: string[];
  isSaved: (productId: string) => boolean;
  toggle: (productId: string) => "saved" | "removed";
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

/** Wishlist tamu (belum login) — digabung ke wishlist user saat login. */
const GUEST_STORAGE_KEY = "khena.wishlist.guest";

function storageKey(userId: string) {
  return `khena.wishlist.${userId}`;
}

function readList(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/**
 * Wishlist per pengguna.
 *
 * PENYIMPANAN SEMENTARA (bagian 8a/8b issue.md): masih di localStorage,
 * karena belum ada satu pun endpoint bisnis yang memakai sesi user
 * (`contract.md` tidak memuat endpoint wishlist). Begitu endpoint server ada,
 * provider ini pindah ke React Query dengan optimistic update, dan
 * localStorage hanya dipakai untuk tamu.
 *
 * `user.id` di sini sudah UUID asli dari `auth_users` (bukan email mock
 * seperti sebelum ISSUE-17), jadi key localStorage tidak lagi berubah kalau
 * user ganti email.
 */
export function WishlistProvider({children}: {children: ReactNode}) {
  const {user, isPending: authIsPending} = useAuth();
  const [productIds, setProductIds] = useState<string[]>([]);

  // Key localStorage yang datanya sedang direpresentasikan oleh `productIds`.
  // Efek tulis di bawah menahan diri sampai ini cocok dengan key aktif —
  // tanpa ini, array kosong dari state awal akan menimpa data tersimpan
  // sebelum proses baca (async, lewat queueMicrotask) sempat selesai.
  const loadedKeyRef = useRef<string | null>(null);
  // Melacak user.id yang wishlist tamunya sudah pernah digabung, supaya
  // penggabungan hanya terjadi sekali per transisi tamu→login.
  const mergedForUserId = useRef<string | null>(null);

  useEffect(() => {
    if (authIsPending) return;
    const activeKey = user ? storageKey(user.id) : GUEST_STORAGE_KEY;

    queueMicrotask(() => {
      if (!user) {
        mergedForUserId.current = null;
        setProductIds(readList(GUEST_STORAGE_KEY));
        loadedKeyRef.current = activeKey;
        return;
      }

      if (mergedForUserId.current === user.id) {
        // Sudah pernah digabung untuk user ini — baca langsung, jangan
        // gabung ulang (mis. saat productIds berubah karena toggle).
        setProductIds(readList(activeKey));
        loadedKeyRef.current = activeKey;
        return;
      }

      // Baru login: gabungkan wishlist tamu (union, tanpa duplikat) ke
      // wishlist user, lalu hapus key tamu — supaya item yang disimpan
      // sebelum login tidak hilang diam-diam.
      const guestIds = readList(GUEST_STORAGE_KEY);
      const userIds = readList(activeKey);
      const merged =
        guestIds.length === 0 ? userIds : Array.from(new Set([...userIds, ...guestIds]));

      if (guestIds.length > 0) {
        window.localStorage.setItem(activeKey, JSON.stringify(merged));
        window.localStorage.removeItem(GUEST_STORAGE_KEY);
      }

      mergedForUserId.current = user.id;
      setProductIds(merged);
      loadedKeyRef.current = activeKey;
    });
  }, [user, authIsPending]);

  useEffect(() => {
    if (authIsPending) return;
    const activeKey = user ? storageKey(user.id) : GUEST_STORAGE_KEY;
    if (loadedKeyRef.current !== activeKey) return;
    window.localStorage.setItem(activeKey, JSON.stringify(productIds));
  }, [productIds, user, authIsPending]);

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
