import type {Metadata} from "next";
import {Suspense} from "react";
import {Container} from "@/presentation/components/ui/container";
import {Eyebrow} from "@/presentation/components/ui/eyebrow";
import {ResetPasswordForm} from "@/presentation/components/account/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your Khena account.",
};

export default function ResetPasswordPage() {
  return (
    <Container className="py-20 lg:py-30">
      <div className="mx-auto max-w-md">
        <Eyebrow>Account</Eyebrow>
        <h1 className="mt-4 font-display text-h2">Reset Password</h1>
        <div className="mt-10">
          {/* useSearchParams (dipakai ResetPasswordForm) butuh boundary
              Suspense supaya build statis Next 16 tidak gagal. */}
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
