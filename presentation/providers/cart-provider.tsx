"use client";

import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import type {ReactNode} from "react";
import type {ColorSwatchKey} from "@/domain/entities/color-swatch";
import type {Product} from "@/domain/entities/product";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  comparePrice?: number;
  color?: ColorSwatchKey;
  colorLabel?: string;
  stock: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  /** `true` setelah cart selesai dibaca dari localStorage (lihat bagian 2.7). */
  isHydrated: boolean;
  addItem: (product: Product, color?: ColorSwatchKey, colorLabel?: string, qty?: number) => void;
  updateQty: (productId: string, color: ColorSwatchKey | undefined, qty: number) => void;
  removeItem: (productId: string, color: ColorSwatchKey | undefined) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "khena.cart";

/** Identitas item cart = kombinasi id + color — bagian 2.7 issue.md. */
function itemKey(productId: string, color?: string) {
  return `${productId}::${color ?? ""}`;
}

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

  const addItem = useCallback(
    (product: Product, color?: ColorSwatchKey, colorLabel?: string, qty = 1) => {
      setItems((prev) => {
        const key = itemKey(product.id, color);
        const existing = prev.find((item) => itemKey(item.productId, item.color) === key);

        if (existing) {
          return prev.map((item) =>
            itemKey(item.productId, item.color) === key
              ? {...item, qty: Math.min(item.qty + qty, product.stock)}
              : item
          );
        }

        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            comparePrice: product.comparePrice,
            color,
            colorLabel,
            stock: product.stock,
            qty: Math.min(qty, product.stock),
          },
        ];
      });
    },
    []
  );

  const updateQty = useCallback(
    (productId: string, color: ColorSwatchKey | undefined, qty: number) => {
      const key = itemKey(productId, color);
      setItems((prev) =>
        prev.map((item) =>
          itemKey(item.productId, item.color) === key
            ? {...item, qty: Math.max(1, Math.min(qty, item.stock))}
            : item
        )
      );
    },
    []
  );

  const removeItem = useCallback((productId: string, color: ColorSwatchKey | undefined) => {
    const key = itemKey(productId, color);
    setItems((prev) => prev.filter((item) => itemKey(item.productId, item.color) !== key));
  }, []);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({items, itemCount, subtotal, isHydrated, addItem, updateQty, removeItem}),
    [items, itemCount, subtotal, isHydrated, addItem, updateQty, removeItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam <CartProvider>");
  return ctx;
}
