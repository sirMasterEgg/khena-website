import type {CheckoutResult, PromoValidation} from "@/domain/services/checkout-service";
import {
  checkoutResultSchema,
  promoValidationSchema,
  shippingCostSchema,
} from "@/infrastructure/api/schemas/checkout";

export function toPromoValidation(raw: unknown): PromoValidation {
  return promoValidationSchema.parse(raw);
}

export function toShippingCost(raw: unknown): number {
  return shippingCostSchema.parse(raw).shippingCost;
}

export function toCheckoutResult(raw: unknown): CheckoutResult {
  return checkoutResultSchema.parse(raw);
}
