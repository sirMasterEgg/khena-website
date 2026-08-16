"use client";

import {useState} from "react";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {cn} from "@/presentation/lib/cn";

export type LifestyleSliderProps = {
  captions: string[];
  productName: string;
};

/** Slider gaya hidup di bawah info PDP — bagian 4.5 issue.md. */
export function LifestyleSlider({captions, productName}: LifestyleSliderProps) {
  const [index, setIndex] = useState(0);

  if (captions.length === 0) return null;

  function go(delta: number) {
    setIndex((current) => (current + delta + captions.length) % captions.length);
  }

  return (
    <div className="relative h-140 w-full overflow-hidden">
      <PlaceholderImage label={`${productName} — ${captions[index]}`} />

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-ink/45 px-6 py-4 text-invert">
        <p className="text-sm">{captions[index]}</p>

        {captions.length > 1 ? (
          <div className="flex items-center gap-4">
            <button type="button" aria-label="Previous slide" onClick={() => go(-1)}>
              <Icon icon={ICONS.chevronLeft} className="size-4" />
            </button>
            <div className="flex gap-2">
              {captions.map((caption, i) => (
                <button
                  key={caption}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={cn("size-1.5 rounded-full", i === index ? "bg-invert" : "bg-invert/40")}
                />
              ))}
            </div>
            <button type="button" aria-label="Next slide" onClick={() => go(1)}>
              <Icon icon={ICONS.chevronRight} className="size-4" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
