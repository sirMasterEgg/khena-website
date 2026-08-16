import type {Metadata} from "next";
import {CheckoutFlow} from "@/presentation/components/checkout/checkout-flow";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Khena order.",
};

export default function CheckoutPage() {
  return <CheckoutFlow />;
}
