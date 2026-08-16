"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Drawer} from "@/presentation/components/ui/drawer";
import {FormField} from "@/presentation/components/ui/form-field";
import {Button} from "@/presentation/components/ui/button";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {useAuth} from "@/presentation/providers/auth-provider";
import {useUi} from "@/presentation/providers/ui-provider";
import {useToast} from "@/presentation/providers/toast-provider";
import {useSavedProducts} from "@/application/hooks/use-saved-products";
import {formatIDR} from "@/presentation/lib/format";

type GuestMode = "signin" | "register" | "confirm";

const signInSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type SignInValues = z.infer<typeof signInSchema>;

const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type RegisterValues = z.infer<typeof registerSchema>;

/** Account drawer — empat mode (bagian 3.4 issue.md). */
export function AccountDrawer() {
  const {isOpen, close} = useUi();
  const open = isOpen("account");
  const {user, signIn, register: registerAccount, signOut} = useAuth();
  const {toast} = useToast();
  const savedProducts = useSavedProducts();

  const [mode, setMode] = useState<GuestMode>("signin");
  const [formError, setFormError] = useState<string | undefined>();

  const signInForm = useForm<SignInValues>({resolver: zodResolver(signInSchema)});
  const registerForm = useForm<RegisterValues>({resolver: zodResolver(registerSchema)});

  // Form di-reset setiap drawer dibuka — bagian 3.4 issue.md. Dibungkus
  // queueMicrotask supaya setState terjadi di dalam callback, bukan langsung
  // di badan efek.
  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => {
      setMode("signin");
      setFormError(undefined);
      signInForm.reset();
      registerForm.reset();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleSignIn(values: SignInValues) {
    setFormError(undefined);
    const result = await signIn(values.email, values.password);
    if (!result.ok) {
      setFormError(
        result.error === "email-not-confirmed"
          ? "Email not confirmed — please check your inbox for the verification link."
          : "Invalid login — check your email and password and try again."
      );
      return;
    }
    toast("Signed in successfully.");
    close();
  }

  async function handleRegister(values: RegisterValues) {
    setFormError(undefined);
    const result = await registerAccount(values.name, values.email, values.password);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    setMode("confirm");
  }

  function handleSignOut() {
    signOut();
    toast("Signed out.");
    close();
  }

  function switchMode(next: GuestMode) {
    setMode(next);
    setFormError(undefined);
  }

  return (
    <Drawer open={open} onClose={close} ariaLabel={user ? "Account" : "Sign In"}>
      <div className="flex items-center justify-between border-b border-ink p-6">
        <h2 className="font-display text-xl">{user ? "Your Account" : "Welcome to Khena"}</h2>
        <button type="button" aria-label="Close" onClick={close}>
          <Icon icon={ICONS.close} className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {user ? (
          <div>
            <div className="flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-ink text-lg text-cream">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-sm">{user.name}</p>
                <p className="text-xs text-muted">{user.email}</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xs uppercase tracking-label text-muted">Saved Pieces</h3>
              {savedProducts.length === 0 ? (
                <p className="mt-3 text-sm text-muted">Pieces you save will appear here.</p>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {savedProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={close}
                      className="block"
                    >
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

            <div className="mt-10 space-y-3 border-t border-hairline pt-6 text-sm">
              <Link href="/checkout" onClick={close} className="block hover:text-accent">
                Track My Order
              </Link>
              <Link href="/shop" onClick={close} className="block hover:text-accent">
                Continue Shopping
              </Link>
            </div>

            <Button variant="dark" className="mt-10 w-full" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        ) : mode === "confirm" ? (
          <div className="text-center">
            <p className="font-display text-h3">Check Your Email</p>
            <p className="mt-4 text-sm text-muted">
              We&apos;ve sent a verification link to your inbox. Confirm your email to finish
              setting up your account.
            </p>
            <Button variant="dark" className="mt-8 w-full" onClick={() => switchMode("signin")}>
              Back to Sign In
            </Button>
          </div>
        ) : mode === "signin" ? (
          <form onSubmit={signInForm.handleSubmit(handleSignIn)} noValidate className="space-y-6">
            <FormField
              label="Email"
              type="email"
              {...signInForm.register("email")}
              error={signInForm.formState.errors.email?.message}
            />
            <FormField
              label="Password"
              type="password"
              {...signInForm.register("password")}
              error={signInForm.formState.errors.password?.message}
            />
            {formError ? <p className="text-xs text-danger">{formError}</p> : null}
            <Button
              type="submit"
              variant="dark"
              size="lg"
              className="w-full"
              disabled={signInForm.formState.isSubmitting}
            >
              Sign In
            </Button>
            <p className="text-center text-xs text-muted">
              New to Khena?{" "}
              <button type="button" className="underline" onClick={() => switchMode("register")}>
                Create an account
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} noValidate className="space-y-6">
            <FormField
              label="Full Name"
              {...registerForm.register("name")}
              error={registerForm.formState.errors.name?.message}
            />
            <FormField
              label="Email"
              type="email"
              {...registerForm.register("email")}
              error={registerForm.formState.errors.email?.message}
            />
            <FormField
              label="Password"
              type="password"
              {...registerForm.register("password")}
              error={registerForm.formState.errors.password?.message}
            />
            {formError ? <p className="text-xs text-danger">{formError}</p> : null}
            <Button
              type="submit"
              variant="dark"
              size="lg"
              className="w-full"
              disabled={registerForm.formState.isSubmitting}
            >
              Create Account
            </Button>
            <p className="text-center text-xs text-muted">
              Already have an account?{" "}
              <button type="button" className="underline" onClick={() => switchMode("signin")}>
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </Drawer>
  );
}
