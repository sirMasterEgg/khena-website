"use client";

import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import type {ReactNode} from "react";

export type CartItem = {
  /** `products.base_sku` — untuk menaut balik ke /product/[sku]. */
  productSku: string;
  /** `detail_products.detail_product_sku` — identitas baris cart (D9). */
  variantSku: string;
  name: string;
  image?: string;
  colorName?: string;
  colorHex?: string;
  /** Harga normal, dipakai untuk teks dicoret. */
  price: number;
  /** Harga yang dibayar — semua total memakai ini. */
  priceAfterDiscount: number;
  stock: number;
  qty: number;
};

export type AddToCartInput = Omit<CartItem, "qty">;

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  /** `true` setelah cart selesai dibaca dari localStorage (lihat bagian 2.7). */
  isHydrated: boolean;
  addItem: (input: AddToCartInput, qty?: number) => void;
  updateQty: (variantSku: string, qty: number) => void;
  removeItem: (variantSku: string) => void;
  /** Dipanggil setelah checkout berhasil (issue #43) — order sudah terbentuk di backend. */
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
// Bentuk CartItem lama (berbasis productId + color swatch) tidak kompatibel
// dengan bentuk berbasis varian (issue #40, D9/D10). Bump key supaya cart
// lama di browser pengunjung diabaikan alih-alih dibaca dalam bentuk salah.
const STORAGE_KEY = "khena.cart.v2";

export function CartProvider({children}: {children: ReactNode}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Cart dibaca dari localStorage setelah mount supaya tidak ada hydration
  // mismatch (localStorage tidak ada di server). Dibungkus queueMicrotask
  // supaya setState terjadi di dalam callback, bukan langsung di badan efek.
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw) as CartItem[]);
      } catch {
        // localStorage tidak tersedia atau datanya korup — mulai dari cart kosong.
      } finally {
        setIsHydrated(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem = useCallback((input: AddToCartInput, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.variantSku === input.variantSku);

      if (existing) {
        // Harga/stok bisa berubah sejak item masuk cart — segarkan dari input.
        return prev.map((item) =>
          item.variantSku === input.variantSku
            ? {...item, ...input, qty: Math.min(item.qty + qty, input.stock)}
            : item
        );
      }

      return [...prev, {...input, qty: Math.min(qty, input.stock)}];
    });
  }, []);

  const updateQty = useCallback((variantSku: string, qty: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.variantSku === variantSku
          ? {...item, qty: Math.max(1, Math.min(qty, item.stock))}
          : item
      )
    );
  }, []);

  const removeItem = useCallback((variantSku: string) => {
    setItems((prev) => prev.filter((item) => item.variantSku !== variantSku));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.priceAfterDiscount * item.qty, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({items, itemCount, subtotal, isHydrated, addItem, updateQty, removeItem, clearCart}),
    [items, itemCount, subtotal, isHydrated, addItem, updateQty, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam <CartProvider>");
  return ctx;
}
