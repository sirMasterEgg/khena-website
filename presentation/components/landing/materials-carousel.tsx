"use client";

import {useEffect, useState} from "react";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import {TextLink} from "@/presentation/components/ui/text-link";
import {cn} from "@/presentation/lib/cn";

const MATERIAL_SLIDES = [
  {
    title: "Our Materials",
    body: "Every piece begins with material chosen for how it ages, not just how it looks on day one.",
  },
  {
    title: "Solid Timber",
    body: "Kiln-dried teak and oak, joined with traditional techniques built to outlast trends.",
  },
  {
    title: "Hand-Loomed Textile",
    body: "Woven by artisan partners using natural fibres, dyed in small, considered batches.",
  },
  {
    title: "Natural Stone",
    body: "Quarried stone surfaces, each with its own grain — no two pieces are ever identical.",
  },
] as const;

const INTERVAL_MS = 5000;

/** Materials Carousel — bagian 4.1 issue.md. */
export function MaterialsCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MATERIAL_SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused]);

  const active = MATERIAL_SLIDES[index];

  return (
    <section
      className="mt-27.5 bg-warm py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto grid max-w-355 grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-square overflow-hidden">
          {MATERIAL_SLIDES.map((slide, i) => (
            <div
              key={slide.title}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-brand",
                i === index ? "opacity-100" : "opacity-0"
              )}
            >
              <PlaceholderImage label={slide.title} />
            </div>
          ))}
        </div>

        <div>
          <p className="text-eyebrow uppercase tracking-eyebrow text-muted">Craftsmanship</p>
          <h2 className="mt-2 min-h-[2.2em] font-display text-h3 transition-opacity duration-500 ease-brand">
            {active.title}
          </h2>
          <p className="mt-4 min-h-[5.5em] text-base text-muted transition-opacity duration-500 ease-brand">
            {active.body}
          </p>
          <div className="mt-6">
            <TextLink href="/about">DISCOVER THE MATERIALS</TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
