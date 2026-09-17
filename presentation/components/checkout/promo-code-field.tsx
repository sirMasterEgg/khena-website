"use client";

import {useState} from "react";
import type {KeyboardEvent} from "react";
import type {PromoValidation} from "@/domain/services/checkout-service";
import {checkoutService} from "@/infrastructure/services/client";
import {toCheckoutErrorMessage} from "@/presentation/lib/checkout-errors";
import type {CartItem} from "@/presentation/providers/cart-provider";
import {Button} from "@/presentation/components/ui/button";
import {FormField} from "@/presentation/components/ui/form-field";

export type PromoCodeFieldProps = {
  items: CartItem[];
  /** Promo yang sedang aktif untuk isi cart saat ini, `null` kalau belum ada. */
  applied: PromoValidation | null;
  onApply: (result: PromoValidation) => void;
  onRemove: () => void;
};

/** Input kode promo di checkout — contract.md Bagian 38, issue #43. */
export function PromoCodeField({items, applied, onApply, onRemove}: PromoCodeFieldProps) {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApply() {
    const trimmed = code.trim();
    if (!trimmed) return;

    setIsValidating(true);
    setError(null);
    try {
      const result = await checkoutService.validatePromo(
        trimmed,
        items.map((item) => ({sku: item.variantSku, quantity: item.qty}))
      );
      onApply(result);
      setCode("");
    } catch (err) {
      setError(toCheckoutErrorMessage(err, items));
    } finally {
      setIsValidating(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    // Enter di sini TIDAK boleh men-submit form checkout di sekelilingnya.
    if (event.key !== "Enter") return;
    event.preventDefault();
    void handleApply();
  }

  if (applied) {
    return (
      <div className="mt-4 flex items-center justify-between border border-hairline bg-warm px-4 py-3 text-sm">
        <span>
          Code <strong>{applied.code}</strong> applied
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs uppercase tracking-label text-muted hover:text-ink"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-end gap-3">
        <FormField
          label="Promo Code"
          wrapperClassName="flex-1"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isValidating}
        />
        <Button type="button" onClick={handleApply} disabled={isValidating || !code.trim()}>
          {isValidating ? "Applying…" : "Apply"}
        </Button>
      </div>
      {error ? <p className="mt-1 text-xs text-danger">{error}</p> : null}
    </div>
  );
}
