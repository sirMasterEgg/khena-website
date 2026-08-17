"use client";

import {Children, useEffect, useRef, useState} from "react";
import type {ReactNode} from "react";
import {cn} from "@/presentation/lib/cn";

export type RevealStaggerProps = {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  staggerMs?: number;
};

/**
 * Sama seperti `<Reveal>`, tapi anak-anaknya muncul berurutan dengan jeda —
 * bagian 1.6 issue.md.
 */
export function RevealStagger({
  children,
  className,
  itemClassName,
  staggerMs = 100,
}: RevealStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // threshold rendah + rootMargin negatif di bawah supaya grid tinggi
    // (banyak baris) tetap terpicu begitu mulai masuk viewport, bukan
    // menunggu 20% dari TINGGI TOTAL grid itu sendiri terlihat.
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
    <div ref={ref} className={className}>
      {Children.toArray(children).map((child, index) => (
        <div
          key={index}
          className={cn("opacity-0", visible && "animate-reveal-up", itemClassName)}
          style={visible ? {animationDelay: `${index * staggerMs}ms`} : undefined}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
