import type {Metadata} from "next";
import {Container} from "@/presentation/components/ui/container";
import {TextLink} from "@/presentation/components/ui/text-link";

export const metadata: Metadata = {
  title: "Order Status",
  robots: {index: false},
};

type FinishSearchParams = {[key: string]: string | string[] | undefined};

function firstValue(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : Array.isArray(value) ? value[0] : undefined;
}

const PAID_STATUSES = new Set(["settlement", "capture"]);
const CANCELLED_STATUSES = new Set(["deny", "cancel", "expire", "failure"]);

/**
 * Halaman kembalian dari Midtrans Snap (Finish/Unfinish/Error URL) —
 * contract.md Bagian 39-40, issue #43. TIDAK memanggil API apa pun: tidak ada
 * endpoint publik untuk cek status order, jadi teks di sini murni dari query
 * string yang dikirim Midtrans (A3 di issue.md) — status final tetap
 * ditentukan webhook di backend.
 */
export default async function CheckoutFinishPage({
  searchParams,
}: {
  searchParams: Promise<FinishSearchParams>;
}) {
  const params = await searchParams;
  const orderId = firstValue(params.order_id);
  const transactionStatus = firstValue(params.transaction_status);

  const {title, message} = describeStatus(transactionStatus);

  return (
    <Container className="flex flex-col items-center gap-4 py-30 text-center">
      <p className="font-display text-h3">{title}</p>
      <p className="max-w-125 text-sm text-muted">{message}</p>
      {orderId ? <p className="text-xs text-muted">Order number: {orderId}</p> : null}
      <TextLink href="/shop">CONTINUE SHOPPING</TextLink>
    </Container>
  );
}

function describeStatus(transactionStatus: string | undefined): {title: string; message: string} {
  if (transactionStatus && PAID_STATUSES.has(transactionStatus)) {
    return {
      title: "Thank You",
      message: "We've received your payment. Our team will process your order shortly.",
    };
  }

  if (transactionStatus === "pending") {
    return {
      title: "Complete Your Payment",
      message:
        "Your order has been placed. Please finish the payment using the instructions from Midtrans before it expires.",
    };
  }

  if (transactionStatus && CANCELLED_STATUSES.has(transactionStatus)) {
    return {
      title: "Payment Not Completed",
      message:
        "Your payment wasn't completed, so the order has been cancelled. You can place a new order anytime.",
    };
  }

  return {
    title: "Order Received",
    message: "If you completed the payment, our team will process your order once it's confirmed.",
  };
}
