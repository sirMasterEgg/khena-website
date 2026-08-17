"use client";

import {useEffect, useRef, useState} from "react";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import {Button} from "@/presentation/components/ui/button";
import {SplitHeadline} from "@/presentation/components/motion/split-headline";

const BUTTON_DELAY_MS = 600;
const PARALLAX_FACTOR = 0.22;

/** Hero landing 700px — bagian 4.1 issue.md. */
export function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), BUTTON_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Ken Burns berjalan lewat CSS animation (elemen anak); parallax scroll
  // menulis translateY lewat ref supaya tidak bentrok dengan transform
  // animasi Ken Burns pada elemen yang sama.
  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (parallaxRef.current) {
          parallaxRef.current.style.transform = `translateY(${window.scrollY * PARALLAX_FACTOR}px)`;
        }
        ticking = false;
      });
    }

    window.addEventListener("scroll", handleScroll, {passive: true});
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-175 overflow-hidden">
      <div ref={parallaxRef} className="absolute inset-0">
        <div className="absolute inset-0 animate-ken-burns">
          <PlaceholderImage className="h-full w-full" />
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-invert">
        <p className="text-eyebrow uppercase tracking-eyebrow">Spring / Summer 2026</p>
        <h1 className="mt-6 font-display text-hero">
          <SplitHeadline text="Timeless Living" />
        </h1>
        <div
          className={`mt-10 transition-opacity duration-700 ease-brand ${
            showButton ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button href="/collections" variant="light">
            Discover Collection
          </Button>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 hidden flex-col items-center gap-3 text-invert sm:flex">
        <span className="text-xs uppercase tracking-eyebrow">Scroll</span>
        <span className="h-12 w-px animate-scroll-cue bg-invert" aria-hidden="true" />
      </div>
    </section>
  );
}
