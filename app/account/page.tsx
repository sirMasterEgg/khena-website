import type {Metadata} from "next";
import {RequireAuth} from "@/presentation/components/auth/require-auth";
import {AccountPage} from "@/presentation/components/account/account-page";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your Khena account.",
};

export default function Account() {
  return (
    <RequireAuth>
      <AccountPage />
    </RequireAuth>
  );
}
