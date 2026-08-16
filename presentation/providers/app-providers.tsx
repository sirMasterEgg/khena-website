import type {ReactNode} from "react";
import {QueryProvider} from "@/presentation/providers/query-provider";
import {ToastProvider} from "@/presentation/providers/toast-provider";
import {UiProvider} from "@/presentation/providers/ui-provider";

/**
 * Satu titik komposisi seluruh provider client — bagian 2.7 issue.md. Provider
 * baru (Cart, Auth, Wishlist, dst.) ditambahkan di sini, bukan ditumpuk
 * langsung di `app/layout.tsx`.
 */
export function AppProviders({children}: {children: ReactNode}) {
  return (
    <QueryProvider>
      <ToastProvider>
        <UiProvider>{children}</UiProvider>
      </ToastProvider>
    </QueryProvider>
  );
}
