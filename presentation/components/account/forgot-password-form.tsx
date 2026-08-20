"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {FormField} from "@/presentation/components/ui/form-field";
import {Button} from "@/presentation/components/ui/button";
import {authClient} from "@/infrastructure/auth/auth-client";
import {authErrorMessage} from "@/infrastructure/auth/error-messages";
import {clientEnv} from "@/config/env.client";

const schema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
});
type Values = z.infer<typeof schema>;

/**
 * Form lupa password (Fase 5 issue.md). Selalu menampilkan pesan sukses yang
 * sama setelah submit — baik email itu terdaftar atau tidak — supaya tidak
 * membocorkan email mana yang punya akun.
 */
export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();
  const form = useForm<Values>({resolver: zodResolver(schema)});

  async function handleSubmit(values: Values) {
    setFormError(undefined);
    // redirectTo diperiksa backend terhadap trustedOrigins — wajib diturunkan
    // dari NEXT_PUBLIC_APP_URL (atau origin saat ini kalau env belum diisi),
    // jangan di-hardcode.
    const redirectTo = `${clientEnv.NEXT_PUBLIC_APP_URL ?? window.location.origin}/reset-password`;
    const {error} = await authClient.requestPasswordReset({email: values.email, redirectTo});
    if (error) {
      setFormError(authErrorMessage(error));
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-sm text-muted">
        If that email is registered, we&apos;ve sent a reset link.
      </p>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="space-y-6">
      <FormField
        label="Email"
        type="email"
        {...form.register("email")}
        error={form.formState.errors.email?.message}
      />
      {formError ? <p className="text-xs text-danger">{formError}</p> : null}
      <Button
        type="submit"
        variant="dark"
        size="lg"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        Send Reset Link
      </Button>
    </form>
  );
}
