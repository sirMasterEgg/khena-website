"use client";

import type {ReactNode} from "react";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {Button} from "@/presentation/components/ui/button";
import {Container} from "@/presentation/components/ui/container";
import {useAuth} from "@/presentation/providers/auth-provider";
import {useUi} from "@/presentation/providers/ui-provider";

/**
 * Guard UX untuk halaman yang butuh sesi. INI BUKAN LAPISAN KEAMANAN —
 * penegakan sesungguhnya ada di backend yang menolak request tanpa cookie
 * sesi. Guard ini hanya mencegah user melihat kerangka halaman kosong
 * (bagian 3 keputusan #4 issue.md).
 */
export function RequireAuth({children}: {children: ReactNode}) {
  const {user, isPending} = useAuth();
  const {open} = useUi();

  // Sesi belum selesai diambil dari server — render placeholder netral, jangan
  // kedip antara ajakan sign in dan konten.
  if (isPending) {
    return <Container className="py-24" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <Container className="flex flex-col items-center py-24 text-center">
        <Icon icon={ICONS.lock} className="size-8 text-faint" />
        <h1 className="mt-6 font-display text-h3">Sign in to continue</h1>
        <p className="mt-4 max-w-sm text-sm text-muted">
          You need to be signed in to view this page.
        </p>
        <Button variant="dark" size="lg" className="mt-8" onClick={() => open("account")}>
          Sign In
        </Button>
      </Container>
    );
  }

  return <>{children}</>;
}
