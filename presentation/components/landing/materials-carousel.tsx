"use client";

import {useEffect, useState} from "react";
import {RemoteImage} from "@/presentation/components/ui/remote-image";
import {TextLink} from "@/presentation/components/ui/text-link";
import {cn} from "@/presentation/lib/cn";
import type {CraftmanshipContent} from "@/domain/entities/landing-content";

/** Materials Carousel — bagian 4.1 issue.md, konten dari CMS (issue #27). */
export function MaterialsCarousel({content}: {content: CraftmanshipContent}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const {slides} = content;

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, content.intervalMs);
    return () => clearInterval(timer);
  }, [paused, slides.length, content.intervalMs]);

  const active = slides[index];

  return (
    <section
      className="mt-27.5 bg-warm py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto grid max-w-355 grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-square overflow-hidden">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-brand",
                i === index ? "opacity-100" : "opacity-0"
              )}
            >
              <RemoteImage src={slide.image} alt={slide.title} label={slide.title} />
            </div>
          ))}
        </div>

        <div>
          <p className="text-eyebrow uppercase tracking-eyebrow text-muted">{content.eyebrow}</p>
          <h2 className="mt-2 min-h-[2.2em] font-display text-h3 transition-opacity duration-500 ease-brand">
            {active.title}
          </h2>
          <p className="mt-4 min-h-[5.5em] text-base text-muted transition-opacity duration-500 ease-brand">
            {active.body}
          </p>
          <div className="mt-6">
            <TextLink href={content.ctaHref}>{content.ctaLabel}</TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
