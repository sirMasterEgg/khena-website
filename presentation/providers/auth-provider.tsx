"use client";

import {createContext, useCallback, useContext, useEffect, useState} from "react";
import type {ReactNode} from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type SignInError = "invalid-login" | "email-not-confirmed";

type SignInResult = {ok: true} | {ok: false; error: SignInError};
type RegisterResult = {ok: true} | {ok: false; error: string};

type AuthContextValue = {
  user: AuthUser | null;
  isHydrated: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  register: (name: string, email: string, password: string) => Promise<RegisterResult>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "khena.auth-user";

// TODO(ISSUE-15): ganti dengan panggilan API auth sungguhan.
// "demo@khena.co.id" / "khena123" sudah terverifikasi, untuk uji alur sign in.
const MOCK_ACCOUNTS: {email: string; password: string; name: string; confirmed: boolean}[] = [
  {email: "demo@khena.co.id", password: "khena123", name: "Demo User", confirmed: true},
];

export function AuthProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Baca sesi dari localStorage setelah mount supaya tidak ada hydration mismatch.
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setUser(JSON.parse(raw) as AuthUser);
      } catch {
        // localStorage tidak tersedia atau datanya korup — mulai tanpa sesi.
      } finally {
        setIsHydrated(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, isHydrated]);

  const signIn = useCallback(async (email: string, password: string): Promise<SignInResult> => {
    const account = MOCK_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!account || account.password !== password) {
      return {ok: false, error: "invalid-login"};
    }
    if (!account.confirmed) {
      return {ok: false, error: "email-not-confirmed"};
    }
    setUser({id: account.email, name: account.name, email: account.email});
    return {ok: true};
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<RegisterResult> => {
      if (MOCK_ACCOUNTS.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
        return {ok: false, error: "An account with this email already exists."};
      }
      MOCK_ACCOUNTS.push({email, password, name, confirmed: false});
      return {ok: true};
    },
    []
  );

  const signOut = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{user, isHydrated, signIn, register, signOut}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
