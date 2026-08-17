"use client";

import {useEffect, useRef, useState} from "react";
import type {ReactNode} from "react";
import {cn} from "@/presentation/lib/cn";

export type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

/**
 * Fade + geser ke atas saat elemen masuk viewport — bagian 1.6 issue.md.
 * IntersectionObserver di-disconnect() setelah terpicu maupun saat unmount.
 */
export function Reveal({children, className, delayMs = 0}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // threshold rendah + rootMargin negatif di bawah supaya elemen tinggi
    // (mis. grid multi-baris) tetap terpicu begitu mulai masuk viewport,
    // bukan menunggu 20% dari TINGGI TOTALnya sendiri terlihat.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {threshold: 0, rootMargin: "0px 0px -10% 0px"}
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("opacity-0", visible && "animate-reveal-up", className)}
      style={visible && delayMs ? {animationDelay: `${delayMs}ms`} : undefined}
    >
      {children}
    </div>
  );
}
