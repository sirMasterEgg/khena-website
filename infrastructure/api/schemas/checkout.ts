import {z} from "zod";

/**
 * `POST /api/promo/validate` dan `POST /api/checkout` — contract.md Bagian
 * 38-39. Sengaja TIDAK memakai `.catch(...)` seperti schema lain (mis.
 * product-summary.ts): kalau response tidak sesuai bentuk yang diharapkan
 * (mis. `redirectUrl` hilang), parse harus GAGAL — lebih aman gagal daripada
 * mengarahkan pembeli ke URL pembayaran kosong/rusak.
 */
export const promoValidationSchema = z.object({
  code: z.string(),
  discountType: z.enum(["percentage", "fixed_amount", "free_shipping"]),
  discountValue: z.number(),
  subtotal: z.number(),
  eligibleSubtotal: z.number(),
  discountAmount: z.number(),
  freeShipping: z.boolean(),
});

export const shippingCostSchema = z.object({
  shippingCost: z.number(),
});

export const checkoutResultSchema = z.object({
  orderId: z.string(),
  invoiceNumber: z.string(),
  subtotal: z.number(),
  shippingAmount: z.number(),
  discountAmount: z.number(),
  total: z.number(),
  paymentStatus: z.string(),
  snapToken: z.string(),
  redirectUrl: z.url(),
});
