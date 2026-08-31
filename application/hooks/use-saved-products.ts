"use client";

import {useMemo} from "react";
import {useInfiniteQuery} from "@tanstack/react-query";
import type {ProductSummary} from "@/domain/entities/product-summary";
import {wishlistRepository} from "@/infrastructure/repositories/client";
import {useAuth} from "@/presentation/providers/auth-provider";
import {wishlistListKey} from "@/presentation/providers/wishlist-provider";

/** Sama dengan default backend (contract.md Bagian 35). */
const PAGE_SIZE = 12;

/**
 * Produk yang tersimpan di wishlist user — langsung dari `GET /api/wishlists`
 * (contract.md Bagian 35), berpaginasi dengan tombol "Load More".
 *
 * Sengaja TERPISAH dari daftar sku di `WishlistProvider`: provider butuh
 * SELURUH sku untuk menentukan state hati di kartu produk manapun, sedangkan
 * layar Saved Pieces hanya perlu halaman yang sedang dilihat user.
 */
export function useSavedProducts() {
  const {user} = useAuth();
  const userId = user?.id ?? null;

  const query = useInfiniteQuery({
    queryKey: wishlistListKey(userId),
    enabled: userId !== null,
    initialPageParam: 1,
    queryFn: ({pageParam, signal}) => wishlistRepository.listPage(pageParam, PAGE_SIZE, signal),
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
  });

  const products = useMemo<ProductSummary[]>(
    () => query.data?.pages.flatMap((page) => page.items.map((item) => item.product)) ?? [],
    [query.data]
  );

  return {
    products,
    // `isPending` tetap true selama query disabled (React Query v5) — untuk
    // tamu itu bukan "sedang memuat", jadi harus digabung dengan cek userId.
    isLoading: userId !== null && query.isPending,
    isError: query.isError,
    hasMore: query.hasNextPage,
    isLoadingMore: query.isFetchingNextPage,
    loadMore: () => query.fetchNextPage(),
  };
}
