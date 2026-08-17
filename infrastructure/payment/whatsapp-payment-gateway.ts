import type {CreateOrderInput, CreateOrderResult, PaymentGateway} from "@/domain/services/payment-gateway";
import {clientEnv} from "@/config/env.client";
import {formatIDR} from "@/presentation/lib/format";

/**
 * Fallback checkout via WhatsApp — bagian 4.10 issue.md. Aktif sekarang
 * karena backend/Xendit belum siap; dipertahankan berdampingan dengan
 * XenditPaymentGateway (ISSUE-15) sampai Xendit terkonfirmasi live.
 */
export class WhatsAppPaymentGateway implements PaymentGateway {
  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const number = clientEnv.NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER ?? "62XXXXXXXXXX";

    const lines = [
      "Halo Khena, saya ingin memesan:",
      "",
      ...input.items.map(
        (item) =>
          `• ${item.name}${item.color ? ` (${item.color})` : ""} x${item.qty} — ${formatIDR(item.price * item.qty)}`
      ),
      "",
      `Subtotal: ${formatIDR(input.subtotal)}`,
      input.shippingFee !== null
        ? `Shipping (${input.shippingZoneName}): ${formatIDR(input.shippingFee)}`
        : `Shipping (${input.shippingZoneName}): quote required`,
      `Tax: ${formatIDR(input.tax)}`,
      `Total: ${formatIDR(input.total)}`,
      "",
      `Name: ${input.customerName}`,
      `Phone: ${input.customerPhone}`,
      `Address: ${input.shippingAddress}`,
    ];

    return {
      redirectUrl: `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`,
    };
  }
}
