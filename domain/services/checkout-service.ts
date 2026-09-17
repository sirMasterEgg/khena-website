export type CheckoutLineItem = {
  /** SKU VARIAN (`detail_products.detail_product_sku`), bukan SKU produk. */
  sku: string;
  quantity: number;
};

export type PromoDiscountType = "percentage" | "fixed_amount" | "free_shipping";

/** Hasil `POST /api/promo/validate` — contract.md Bagian 38. */
export type PromoValidation = {
  code: string;
  discountType: PromoDiscountType;
  discountValue: number;
  subtotal: number;
  eligibleSubtotal: number;
  /** Selalu 0 untuk `free_shipping` — nominalnya dihitung backend saat checkout. */
  discountAmount: number;
  freeShipping: boolean;
};

export type CheckoutRequest = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  deliveryNotes?: string;
  promoCode?: string;
  items: CheckoutLineItem[];
};

/** Hasil `POST /api/checkout` — contract.md Bagian 39. */
export type CheckoutResult = {
  orderId: string;
  invoiceNumber: string;
  subtotal: number;
  shippingAmount: number;
  discountAmount: number;
  total: number;
  paymentStatus: string;
  snapToken: string;
  redirectUrl: string;
};

/**
 * Checkout storefront — contract.md Bagian 38-39. Sesi login opsional: guest
 * boleh checkout, `customer` di-resolve backend lewat cookie sesi kalau ada.
 */
export interface CheckoutService {
  validatePromo(code: string, items: CheckoutLineItem[]): Promise<PromoValidation>;
  /**
   * Estimasi ongkir sebelum submit — provider & rumus sama dengan yang dipakai
   * `placeOrder`, tapi TIDAK mengecek stok (contract.md Bagian 39). Nominal
   * final tetap dihitung ulang backend saat `placeOrder`.
   */
  calculateShippingCost(postalCode: string, items: CheckoutLineItem[], signal?: AbortSignal): Promise<number>;
  placeOrder(request: CheckoutRequest): Promise<CheckoutResult>;
}
