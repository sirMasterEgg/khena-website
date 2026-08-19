import type {Metadata} from "next";
import {Container} from "@/presentation/components/ui/container";
import {Eyebrow} from "@/presentation/components/ui/eyebrow";
import {ForgotPasswordForm} from "@/presentation/components/account/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Khena account password.",
};

export default function ForgotPasswordPage() {
  return (
    <Container className="py-20 lg:py-30">
      <div className="mx-auto max-w-md">
        <Eyebrow>Account</Eyebrow>
        <h1 className="mt-4 font-display text-h2">Forgot Password</h1>
        <p className="mt-4 text-sm text-muted">
          Enter the email linked to your account and we&apos;ll send a link to reset your
          password.
        </p>
        <div className="mt-10">
          <ForgotPasswordForm />
        </div>
      </div>
    </Container>
  );
}
