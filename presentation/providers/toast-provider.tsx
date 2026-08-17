"use client";

import {createContext, useCallback, useContext, useState} from "react";
import type {ReactNode} from "react";

type ToastItem = {id: number; message: string};

type ToastContextValue = {toast: (message: string) => void};

const ToastContext = createContext<ToastContextValue | null>(null);

let toastIdCounter = 0;

/** Notifikasi kecil untuk seluruh situs — bagian 3.7 issue.md. */
export function ToastProvider({children}: {children: ReactNode}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, {id, message}]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{toast}}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-60 flex flex-col items-center gap-2 px-6"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className="pointer-events-auto animate-fade-in bg-ink px-6 py-3 text-sm text-cream"
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus dipakai di dalam <ToastProvider>");
  return ctx;
}
