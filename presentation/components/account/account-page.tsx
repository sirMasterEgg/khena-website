"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Button} from "@/presentation/components/ui/button";
import {Container} from "@/presentation/components/ui/container";
import {Eyebrow} from "@/presentation/components/ui/eyebrow";
import {FormField} from "@/presentation/components/ui/form-field";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import {useAuth} from "@/presentation/providers/auth-provider";
import {useToast} from "@/presentation/providers/toast-provider";
import {useSavedProducts} from "@/application/hooks/use-saved-products";
import {formatIDR} from "@/presentation/lib/format";

// Aturan sama dengan form register (bagian 5 issue.md / contract.md) — nama
// & telepon divalidasi identik di manapun user bisa mengisinya.
const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be between 2 and 255 characters")
    .max(255, "Name must be between 2 and 255 characters"),
  phone: z
    .string()
    .trim()
    .max(20, "Enter a valid phone number")
    .regex(/^\+?[0-9][0-9 -]{6,18}$/, "Enter a valid phone number"),
});
type ProfileValues = z.infer<typeof profileSchema>;

/**
 * Halaman /account — identitas & form update profil, Saved Pieces, sign out
 * (Fase 4 & 6 issue.md). Selalu dirender di dalam <RequireAuth>, jadi `user`
 * sudah pasti ada begitu komponen ini benar-benar merender kontennya.
 */
export function AccountPage() {
  const {user, signOut, updateProfile} = useAuth();
  const {toast} = useToast();
  const savedProducts = useSavedProducts();
  const [profileError, setProfileError] = useState<string | undefined>();

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {name: user?.name ?? "", phone: user?.phone ?? ""},
  });

  // Sinkronkan form begitu sesi membawa nama/telepon baru (mis. setelah
  // update sukses). Efek sengaja tidak berjalan saat update GAGAL — server
  // menolak tanpa mengubah `user`, jadi isian yang sudah diketik tidak
  // ter-reset (AC Fase 6: telepon duplikat tidak menghapus isian).
  useEffect(() => {
    if (!user) return;
    profileForm.reset({name: user.name, phone: user.phone});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.name, user?.phone]);

  // Hooks di atas harus tetap jalan tiap render (Rules of Hooks) — baru
  // setelah itu boleh narrow tipe untuk JSX di bawah. Kondisi ini seharusnya
  // tidak pernah tercapai karena RequireAuth menahan render sampai sesi ada.
  if (!user) return null;

  async function handleSignOut() {
    await signOut();
    toast("Signed out.");
  }

  async function handleUpdateProfile(values: ProfileValues) {
    setProfileError(undefined);
    const result = await updateProfile(values);
    if (!result.ok) {
      setProfileError(result.message);
      return;
    }
    toast("Profile updated.");
  }

  return (
    <Container className="py-16 lg:py-24">
      <Eyebrow>My Account</Eyebrow>
      <h1 className="mt-4 font-display text-h1">{user.name}</h1>

      <div className="mt-12 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="text-xs uppercase tracking-label text-muted">Details</h2>
          <form
            onSubmit={profileForm.handleSubmit(handleUpdateProfile)}
            noValidate
            className="mt-4 space-y-6"
          >
            <FormField
              label="Name"
              {...profileForm.register("name")}
              error={profileForm.formState.errors.name?.message}
            />
            {/* Email read-only — endpoint /update-user tidak menerima
                perubahan email (bagian Fase 6 issue.md). */}
            <FormField label="Email" value={user.email} disabled readOnly hint="Cannot be changed here." />
            <FormField
              label="Phone"
              type="tel"
              {...profileForm.register("phone")}
              error={profileForm.formState.errors.phone?.message}
            />
            {profileError ? <p className="text-xs text-danger">{profileError}</p> : null}
            <Button type="submit" variant="dark" disabled={profileForm.formState.isSubmitting}>
              Save Changes
            </Button>
          </form>

          <Button variant="default" className="mt-10" onClick={handleSignOut}>
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
