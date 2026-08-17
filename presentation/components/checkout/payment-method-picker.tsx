"use client";

import {cn} from "@/presentation/lib/cn";

export type PaymentMethodId = "virtual-account" | "e-wallet" | "credit-card";

const PAYMENT_METHODS: {id: PaymentMethodId; label: string; badge: string; note: string}[] = [
  {
    id: "virtual-account",
    label: "Virtual Account",
    badge: "Bank Transfer",
    note: "BCA, Mandiri, BNI, and more.",
  },
  {
    id: "e-wallet",
    label: "E-Wallet",
    badge: "Instant",
    note: "GoPay, OVO, DANA, ShopeePay.",
  },
  {
    id: "credit-card",
    label: "Credit / Debit Card",
    badge: "Visa · Mastercard",
    note: "Secure card payment.",
  },
];

export type PaymentMethodPickerProps = {
  value: PaymentMethodId;
  onChange: (id: PaymentMethodId) => void;
};

/** Grid kartu metode pembayaran — bagian 4.10 issue.md. */
export function PaymentMethodPicker({value, onChange}: PaymentMethodPickerProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {PAYMENT_METHODS.map((method) => (
        <button
          key={method.id}
          type="button"
          aria-pressed={value === method.id}
          onClick={() => onChange(method.id)}
          className={cn(
            "border p-4 text-left transition-colors duration-300 ease-brand",
            value === method.id ? "border-ink" : "border-hairline"
          )}
        >
          <p className="text-xs uppercase tracking-label text-muted">{method.badge}</p>
          <p className="mt-1 text-sm">{method.label}</p>
          <p className="mt-2 text-xs text-muted">{method.note}</p>
          <p className="mt-3 text-xs uppercase tracking-label text-muted">Powered by Xendit</p>
        </button>
      ))}
    </div>
  );
}
