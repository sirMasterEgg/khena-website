"use client";

import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {FormField} from "@/presentation/components/ui/form-field";
import {Button} from "@/presentation/components/ui/button";
import {TextLink} from "@/presentation/components/ui/text-link";
import {authClient} from "@/infrastructure/auth/auth-client";
import {authErrorMessage} from "@/infrastructure/auth/error-messages";
import {useToast} from "@/presentation/providers/toast-provider";
import {useUi} from "@/presentation/providers/ui-provider";

// Pesan sama dengan skema register — aturan password backend identik di
// /sign-up/email dan /reset-password (lihat validateNewPassword di backend).
const PASSWORD_MESSAGE =
  "password must be at least 8 characters and contain a letter and a number";

const schema = z
  .object({
    password: z
      .string()
      .min(8, PASSWORD_MESSAGE)
      .max(128, PASSWORD_MESSAGE)
      .regex(/[a-zA-Z]/, PASSWORD_MESSAGE)
      .regex(/[0-9]/, PASSWORD_MESSAGE),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type Values = z.infer<typeof schema>;

/**
 * Form set password baru (Fase 5 issue.md). Dibungkus <Suspense> oleh
 * pemanggilnya — `useSearchParams` butuh itu di Next 16 untuk build statis.
 */
export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {toast} = useToast();
  const {open} = useUi();
  const [formError, setFormError] = useState<string | undefined>();

  const token = searchParams.get("token");
  const urlError = searchParams.get("error");

  const form = useForm<Values>({resolver: zodResolver(schema)});

  // Token kosong atau backend menandai link rusak/kedaluwarsa lewat
  // ?error=... — tampilkan ajakan minta link baru, bukan form atau halaman
  // kosong.
  if (urlError || !token) {
    return (
      <div>
        <p className="text-sm text-muted">
          This reset link is invalid or has expired. Request a new one below.
        </p>
        <div className="mt-6">
          <TextLink href="/forgot-password">REQUEST A NEW LINK</TextLink>
        </div>
      </div>
    );
  }

  async function handleSubmit(values: Values) {
    setFormError(undefined);
    const {error} = await authClient.resetPassword({
      token: token as string,
      newPassword: values.password,
    });
    if (error) {
      setFormError(authErrorMessage(error));
      return;
    }
    toast("Password updated.");
    router.push("/");
    open("account");
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="space-y-6">
      <FormField
        label="New Password"
        type="password"
        {...form.register("password")}
        error={form.formState.errors.password?.message}
      />
      <FormField
        label="Confirm Password"
        type="password"
        {...form.register("confirmPassword")}
        error={form.formState.errors.confirmPassword?.message}
      />
      {formError ? <p className="text-xs text-danger">{formError}</p> : null}
      <Button
        type="submit"
        variant="dark"
        size="lg"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        Update Password
      </Button>
    </form>
  );
}
