import type {ReactNode} from "react";
import {QueryProvider} from "@/presentation/providers/query-provider";
import {ToastProvider} from "@/presentation/providers/toast-provider";
import {UiProvider} from "@/presentation/providers/ui-provider";
import {CartProvider} from "@/presentation/providers/cart-provider";
import {AuthProvider} from "@/presentation/providers/auth-provider";
import {WishlistProvider} from "@/presentation/providers/wishlist-provider";

/**
 * Satu titik komposisi seluruh provider client — bagian 2.7 issue.md.
 * WishlistProvider bergantung pada AuthProvider (wishlist per pengguna).
 */
export function AppProviders({children}: {children: ReactNode}) {
  return (
    <QueryProvider>
      <ToastProvider>
        <UiProvider>
          <CartProvider>
            <AuthProvider>
              <WishlistProvider>{children}</WishlistProvider>
            </AuthProvider>
          </CartProvider>
        </UiProvider>
      </ToastProvider>
    </QueryProvider>
  );
}
