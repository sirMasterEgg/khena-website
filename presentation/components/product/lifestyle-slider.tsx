"use client";

import {useState} from "react";
import {RemoteImage} from "@/presentation/components/ui/remote-image";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {cn} from "@/presentation/lib/cn";

export type LifestyleSliderProps = {
  /** URL gambar showcase — `productDetail.media`, sudah terurut dari backend (D5b). */
  images: string[];
  productName: string;
};

/** Slider gaya hidup di bawah info PDP — bagian 4.5 issue.md, gambar asli sejak issue #40 (D5b). */
export function LifestyleSlider({images, productName}: LifestyleSliderProps) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  function go(delta: number) {
    setIndex((current) => (current + delta + images.length) % images.length);
  }

  return (
    <div className="relative h-140 w-full overflow-hidden">
      <RemoteImage src={images[index]} alt={productName} label={productName} sizes="100vw" />

      {/* Bar kontrol hanya muncul kalau ada lebih dari satu gambar — tanpa
          caption, satu gambar tidak butuh bar apa pun (D5b). */}
      {images.length > 1 ? (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-4 bg-ink/45 px-6 py-4 text-invert">
          <button type="button" aria-label="Previous slide" onClick={() => go(-1)}>
            <Icon icon={ICONS.chevronLeft} className="size-4" />
          </button>
          <div className="flex gap-2">
            {images.map((image, i) => (
              <button
                key={`${image}-${i}`}
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
  );
}
