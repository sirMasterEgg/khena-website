import type {CareerApplicationService} from "@/domain/services/career-application-service";
import type {CheckoutService} from "@/domain/services/checkout-service";
import {HttpCareerApplicationService} from "@/infrastructure/services/http-career-application-service";
import {HttpCheckoutService} from "@/infrastructure/services/http-checkout-service";

/**
 * Barrel TERPISAH dari `infrastructure/services/index.ts`, alasannya sama
 * dengan `infrastructure/repositories/client.ts` (D5): berkas ini hanya berisi
 * service yang aman dipanggil dari komponen `"use client"` (transport
 * `apiClient`, tidak menarik apa pun yang `server-only`).
 */
export const careerApplicationService: CareerApplicationService =
  new HttpCareerApplicationService();

/** Checkout storefront (issue #43) — contract.md Bagian 38-39. */
export const checkoutService: CheckoutService = new HttpCheckoutService();
