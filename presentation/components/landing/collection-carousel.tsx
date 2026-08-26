"use client";

import {useCallback, useEffect, useState} from "react";
import Link from "next/link";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {cn} from "@/presentation/lib/cn";
import type {Collection} from "@/domain/entities/collection";

export type CollectionCarouselProps = {
  /** Judul section — dari `signatureCollection.title` CMS (issue #27), gantikan eyebrow hardcode lama. */
  title: string;
  collections: Collection[];
  intervalMs: number;
};

/** Signature Collection Carousel — bagian 4.1 issue.md. Varian cadangan (issue #27), lihat landing-variants.ts. */
export function CollectionCarousel({title, collections, intervalMs}: CollectionCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (target: number) => setIndex((target + collections.length) % collections.length),
    [collections.length]
  );

  useEffect(() => {
    if (paused || collections.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % collections.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [paused, collections.length, intervalMs]);

  if (collections.length === 0) return null;

  const active = collections[index];

  return (
    <section
      className="pt-27.5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-355 px-6 text-center">
        <p className="text-eyebrow uppercase tracking-eyebrow text-muted">{title}</p>
        <h2 className="mt-2 font-display text-h3 transition-opacity duration-500 ease-brand">
          {active.name}
        </h2>
      </div>

      <div className="mx-auto mt-8 max-w-355 px-6">
        <div className="relative aspect-[1114/468] overflow-hidden">
          {collections.map((collection, i) => (
            <div
              key={collection.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-brand",
                i === index ? "opacity-100" : "opacity-0"
              )}
            >
              <Link href={`/shop?collection=${collection.slug}`} className="block h-full w-full">
                <PlaceholderImage label={collection.name} />
              </Link>
            </div>
          ))}

          {collections.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous collection"
                onClick={() => goTo(index - 1)}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-ink"
              >
                <Icon icon={ICONS.chevronLeft} className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next collection"
                onClick={() => goTo(index + 1)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-ink"
              >
                <Icon icon={ICONS.chevronRight} className="size-5" />
              </button>
            </>
          ) : null}
        </div>
      </div>

      {collections.length > 1 ? (
        <div className="mt-6 flex justify-center gap-2">
          {collections.map((collection, i) => (
            <button
              key={collection.id}
              type="button"
              aria-label={`Go to ${collection.name}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className={cn("size-1.5 rounded-full", i === index ? "bg-ink" : "bg-hairline")}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
