import type {CheckoutResult, PromoValidation} from "@/domain/services/checkout-service";
import {checkoutResultSchema, promoValidationSchema} from "@/infrastructure/api/schemas/checkout";

export function toPromoValidation(raw: unknown): PromoValidation {
  return promoValidationSchema.parse(raw);
}

export function toCheckoutResult(raw: unknown): CheckoutResult {
  return checkoutResultSchema.parse(raw);
}
