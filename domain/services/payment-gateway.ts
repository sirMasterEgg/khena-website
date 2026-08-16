export type OrderLineItem = {
  productId: string;
  name: string;
  color?: string;
  qty: number;
  price: number;
};

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  shippingZoneName: string;
  items: OrderLineItem[];
  subtotal: number;
  shippingFee: number | null;
  tax: number;
  total: number;
};

export type CreateOrderResult = {
  /** URL invoice Xendit untuk redirect pembayaran. */
  invoiceUrl?: string;
  /** URL WhatsApp untuk fallback checkout manual. */
  redirectUrl?: string;
};

/**
 * Abstraksi gateway pembayaran — bagian 4.10 issue.md. Dua implementasi:
 * XenditPaymentGateway (POST /orders -> invoiceUrl, ISSUE-15) dan
 * WhatsAppPaymentGateway (fallback aktif sekarang, ISSUE-10).
 */
export interface PaymentGateway {
  createOrder(input: CreateOrderInput): Promise<CreateOrderResult>;
}
