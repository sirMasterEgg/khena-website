"use client";

import {useEffect} from "react";
import {Container} from "@/presentation/components/ui/container";
import {Button} from "@/presentation/components/ui/button";

/** Error boundary bergaya brand — Next.js 16 memakai `unstable_retry`, bukan `reset`. */
export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & {digest?: string};
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Lapor ke layanan pemantauan error di sini kalau sudah ada.
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-eyebrow uppercase tracking-eyebrow text-muted">Error</p>
      <h1 className="mt-4 font-display text-h1">Something Went Wrong</h1>
      <p className="mt-4 max-w-[56ch] text-body-lg text-muted">
        We couldn&apos;t load this page. Please try again in a moment.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button variant="dark" size="lg" onClick={() => unstable_retry()}>
          Try Again
        </Button>
        <Button href="/" size="lg">
          Back to Home
        </Button>
      </div>
    </Container>
  );
}
