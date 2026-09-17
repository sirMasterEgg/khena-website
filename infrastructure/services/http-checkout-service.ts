import type {
  CheckoutLineItem,
  CheckoutRequest,
  CheckoutResult,
  CheckoutService,
  PromoValidation,
} from "@/domain/services/checkout-service";
import {API_ENDPOINTS} from "@/infrastructure/api/endpoints";
import {apiClient} from "@/infrastructure/api/client";
import {toCheckoutResult, toPromoValidation} from "@/infrastructure/api/mappers/checkout";

/**
 * Checkout storefront — contract.md Bagian 38-39. Transport `apiClient`
 * (bukan `serverFetch`): sesi login opsional dibaca backend dari cookie
 * better-auth, yang hanya terkirim kalau request berangkat dari browser.
 */
export class HttpCheckoutService implements CheckoutService {
  async validatePromo(code: string, items: CheckoutLineItem[]): Promise<PromoValidation> {
    const res = await apiClient.post(API_ENDPOINTS.promo.validate, {code, items});
    // `res.data` = envelope {data}.
    return toPromoValidation(res.data.data);
  }

  async placeOrder(request: CheckoutRequest): Promise<CheckoutResult> {
    const res = await apiClient.post(API_ENDPOINTS.checkout.create, request);
    return toCheckoutResult(res.data.data);
  }
}
