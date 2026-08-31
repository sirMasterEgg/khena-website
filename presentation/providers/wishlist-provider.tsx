"use client";

import {createContext, useCallback, useContext, useEffect, useMemo} from "react";
import type {ReactNode} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ApiError} from "@/infrastructure/api/client";
import {wishlistRepository} from "@/infrastructure/repositories/client";
import {useAuth} from "@/presentation/providers/auth-provider";
import {useToast} from "@/presentation/providers/toast-provider";
import {useUi} from "@/presentation/providers/ui-provider";

/** Hasil `toggle` — dipakai WishlistButton untuk memilih animasi. */
export type WishlistToggleOutcome = "saved" | "removed" | "signin-required";

type WishlistContextValue = {
  savedSkus: string[];
  isSaved: (sku: string) => boolean;
  toggle: (sku: string) => WishlistToggleOutcome;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

/**
 * Query key wishlist. `userId` ikut masuk key supaya wishlist user lama tidak
 * pernah terlihat oleh user berikutnya — jadi tidak perlu membersihkan cache
 * secara manual saat sign out.
 */
export const wishlistSkusKey = (userId: string | null) => ["wishlist", "skus", userId] as const;
export const wishlistListKey = (userId: string | null) => ["wishlist", "list", userId] as const;

/** Prefix untuk invalidate kedua query sekaligus setelah mutasi. */
const WISHLIST_KEY_PREFIX = ["wishlist"] as const;

function wishlistErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.isUnauthorized) return "Your session has expired. Please sign in again.";
    // 400 di kontrak ini berarti "product not found" (POST) atau
    // "wishlist not found" (DELETE) — dua-duanya tidak bisa diperbaiki user
    // dengan mencoba lagi, jadi pesannya bukan "please try again".
    if (error.status === 400) return "This piece is no longer available.";
  }
  return "Could not update your wishlist. Please try again.";
}

/**
 * Wishlist user — contract.md Bagian 35. Sumber kebenaran ada di server; tidak
 * ada penyimpanan lokal sama sekali (keputusan D2 issue ini). Tamu yang menekan
 * tombol wishlist diarahkan ke drawer sign in.
 */
export function WishlistProvider({children}: {children: ReactNode}) {
  const {user} = useAuth();
  const {toast} = useToast();
  const {open} = useUi();
  const queryClient = useQueryClient();
  const userId = user?.id ?? null;
  const skusKey = wishlistSkusKey(userId);

  // Bersih-bersih sekali: wishlist versi lama disimpan di localStorage
  // ("khena.wishlist.guest" / "khena.wishlist.<userId>"). Sejak issue ini data
  // itu tidak pernah dibaca lagi, jadi jangan ditinggal menumpuk di browser user.
  useEffect(() => {
    try {
      for (const key of Object.keys(window.localStorage)) {
        if (key.startsWith("khena.wishlist.")) window.localStorage.removeItem(key);
      }
    } catch {
      // localStorage bisa diblokir (private mode) — abaikan, ini hanya bersih-bersih.
    }
  }, []);

  const {data: savedSkus = []} = useQuery({
    queryKey: skusKey,
    // Tamu tidak punya wishlist server — jangan menembak endpoint yang pasti 401.
    enabled: userId !== null,
    queryFn: ({signal}) => wishlistRepository.listAllSkus(signal),
  });

  const addMutation = useMutation({
    mutationFn: (sku: string) => wishlistRepository.add(sku),
    onMutate: async (sku) => {
      await queryClient.cancelQueries({queryKey: skusKey});
      const previous = queryClient.getQueryData<string[]>(skusKey);
      queryClient.setQueryData<string[]>(skusKey, (current = []) =>
        current.includes(sku) ? current : [...current, sku]
      );
      return {previous};
    },
    onError: (error, _sku, context) => {
      // `previous` bisa undefined kalau query belum pernah sukses — menyetel
      // undefined menghapus cache-nya, dan onSettled di bawah mengambil ulang.
      queryClient.setQueryData(skusKey, context?.previous);
      toast(wishlistErrorMessage(error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: WISHLIST_KEY_PREFIX});
    },
  });

  const removeMutation = useMutation({
    mutationFn: (sku: string) => wishlistRepository.remove(sku),
    onMutate: async (sku) => {
      await queryClient.cancelQueries({queryKey: skusKey});
      const previous = queryClient.getQueryData<string[]>(skusKey);
      queryClient.setQueryData<string[]>(skusKey, (current = []) =>
        current.filter((saved) => saved !== sku)
      );
      return {previous};
    },
    onError: (error, _sku, context) => {
      queryClient.setQueryData(skusKey, context?.previous);
      toast(wishlistErrorMessage(error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: WISHLIST_KEY_PREFIX});
    },
  });

  const isSaved = useCallback((sku: string) => savedSkus.includes(sku), [savedSkus]);

  const toggle = useCallback(
    (sku: string): WishlistToggleOutcome => {
      if (!user) {
        open("account");
        toast("Sign in to save pieces.");
        return "signin-required";
      }
      if (savedSkus.includes(sku)) {
        removeMutation.mutate(sku);
        return "removed";
      }
      addMutation.mutate(sku);
      return "saved";
    },
    [user, savedSkus, open, toast, addMutation, removeMutation]
  );

  const value = useMemo<WishlistContextValue>(
    () => ({savedSkus, isSaved, toggle}),
    [savedSkus, isSaved, toggle]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist harus dipakai di dalam <WishlistProvider>");
  return ctx;
}
