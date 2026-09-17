import {ApiError} from "@/infrastructure/api/client";
import type {CartItem} from "@/presentation/providers/cart-provider";

/** Prefix pesan stok kurang dari backend, mis. `insufficient stock for SOFA-JATI-BRN, MEJA-01`. */
const INSUFFICIENT_STOCK_PREFIX = "insufficient stock for ";

const GENERIC_MESSAGE = "Something went wrong. Please try again.";

const KNOWN_MESSAGES: Record<string, string> = {
  "promo code not found": "This promo code doesn't exist.",
  "promo code is not active": "This promo code is no longer active.",
  "promo code is not yet valid": "This promo code isn't valid yet.",
  "promo code has expired": "This promo code has expired.",
  "promo code usage limit reached": "This promo code has reached its usage limit.",
  "promo code is not applicable to this order":
    "This promo code can't be applied to the items in your bag.",
  "product variant not found": "Some items in your bag are no longer available. Please review your bag.",
  "duplicate product in items": "There's a problem with your bag. Please review it and try again.",
  "items must not be empty": "There's a problem with your bag. Please review it and try again.",
  "failed to calculate shipping cost":
    "We couldn't calculate shipping to this address. Please check it or try again later.",
  "failed to create payment": "We couldn't start the payment. Please try again.",
};

/** Cari nama tampilan item dari SKU varian — dipakai untuk pesan stok kurang. */
function describeItem(sku: string, items: CartItem[]): string {
  const item = items.find((cartItem) => cartItem.variantSku === sku);
  if (!item) return sku;
  return item.colorName ? `${item.name} (${item.colorName})` : item.name;
}

/** Pesan error backend (contract.md Bagian 38-39) → teks ramah untuk pembeli. */
export function toCheckoutErrorMessage(error: unknown, items: CartItem[]): string {
  if (!(error instanceof ApiError)) return GENERIC_MESSAGE;

  const serverMessage = error.serverMessage;
  if (!serverMessage) {
    return error.status === 422 ? "Please check your details and try again." : GENERIC_MESSAGE;
  }

  if (serverMessage.startsWith(INSUFFICIENT_STOCK_PREFIX)) {
    const skus = serverMessage
      .slice(INSUFFICIENT_STOCK_PREFIX.length)
      .split(",")
      .map((sku) => sku.trim())
      .filter(Boolean);
    const names = skus.map((sku) => describeItem(sku, items));
    return `Some items are no longer available in the requested quantity: ${names.join(", ")}.`;
  }

  if (serverMessage in KNOWN_MESSAGES) return KNOWN_MESSAGES[serverMessage];

  return error.status === 422 ? "Please check your details and try again." : GENERIC_MESSAGE;
}
