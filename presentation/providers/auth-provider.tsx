"use client";

import {createContext, useCallback, useContext, useMemo} from "react";
import type {ReactNode} from "react";
import {authClient, type AuthUser} from "@/infrastructure/auth/auth-client";
import {authErrorMessage} from "@/infrastructure/auth/error-messages";

export type {AuthUser};

type Result = {ok: true} | {ok: false; message: string};

type AuthContextValue = {
  user: AuthUser | null;
  /** true selama sesi masih diambil dari server — render UI netral dulu. */
  isPending: boolean;
  signIn: (email: string, password: string) => Promise<Result>;
  signUp: (input: {name: string; email: string; password: string; phone: string}) => Promise<Result>;
  signOut: () => Promise<void>;
  updateProfile: (input: {name?: string; phone?: string}) => Promise<Result>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Sesi dibaca dari satu sumber kebenaran: `authClient.useSession()`. Provider
 * ini hanya pembungkus tipis di atasnya — tidak ada state atau localStorage
 * sendiri untuk sesi (bagian 3 keputusan #3 issue.md).
 */
export function AuthProvider({children}: {children: ReactNode}) {
  const {data, isPending, refetch} = authClient.useSession();
  const user = data?.user ?? null;

  const signIn = useCallback(async (email: string, password: string): Promise<Result> => {
    const {error} = await authClient.signIn.email({email, password});
    if (error) return {ok: false, message: authErrorMessage(error)};
    return {ok: true};
  }, []);

  const signUp = useCallback(
    async (input: {name: string; email: string; password: string; phone: string}): Promise<Result> => {
      const {error} = await authClient.signUp.email(input);
      if (error) return {ok: false, message: authErrorMessage(error)};
      return {ok: true};
    },
    []
  );

  const signOut = useCallback(async () => {
    // Sesi di-refetch otomatis oleh authClient setelah sign out — tidak ada
    // state lokal yang perlu direset manual.
    await authClient.signOut();
  }, []);

  const updateProfile = useCallback(
    async (input: {name?: string; phone?: string}): Promise<Result> => {
      const {error} = await authClient.updateUser(input);
      if (error) return {ok: false, message: authErrorMessage(error)};
      // Klien better-auth biasanya memperbarui cache sesi sendiri, tapi
      // di-refetch eksplisit sebagai jaring pengaman — bukan
      // `window.location.reload()` (bagian Fase 6 issue.md).
      refetch();
      return {ok: true};
    },
    [refetch]
  );

  const value = useMemo<AuthContextValue>(
    () => ({user, isPending, signIn, signUp, signOut, updateProfile}),
    [user, isPending, signIn, signUp, signOut, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
