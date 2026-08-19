"use client";

import Link from "next/link";
import {Button} from "@/presentation/components/ui/button";
import {Container} from "@/presentation/components/ui/container";
import {Eyebrow} from "@/presentation/components/ui/eyebrow";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import {useAuth} from "@/presentation/providers/auth-provider";
import {useToast} from "@/presentation/providers/toast-provider";
import {useSavedProducts} from "@/application/hooks/use-saved-products";
import {formatIDR} from "@/presentation/lib/format";

/**
 * Halaman /account — identitas user dan Saved Pieces (Fase 4 issue.md).
 * Selalu dirender di dalam <RequireAuth>, jadi `user` sudah pasti ada.
 */
export function AccountPage() {
  const {user, signOut} = useAuth();
  const {toast} = useToast();
  const savedProducts = useSavedProducts();

  // Narrow tipe saja — kondisi !user seharusnya tidak pernah tercapai karena
  // RequireAuth sudah menahan render sampai sesi ada.
  if (!user) return null;

  async function handleSignOut() {
    await signOut();
    toast("Signed out.");
  }

  return (
    <Container className="py-16 lg:py-24">
      <Eyebrow>My Account</Eyebrow>
      <h1 className="mt-4 font-display text-h1">{user.name}</h1>

      <div className="mt-12 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="text-xs uppercase tracking-label text-muted">Details</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-xs text-muted">Name</dt>
              <dd className="mt-1">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Email</dt>
              <dd className="mt-1">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Phone</dt>
              <dd className="mt-1">{user.phone}</dd>
            </div>
          </dl>

          <Button variant="dark" className="mt-10" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-label text-muted">Saved Pieces</h2>
          {savedProducts.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Pieces you save will appear here.</p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {savedProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`} className="block">
                  <div className="aspect-square bg-warm">
                    <PlaceholderImage label={product.name} />
                  </div>
                  <p className="mt-2 text-xs">{product.name}</p>
                  <p className="text-xs text-muted">{formatIDR(product.price)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
