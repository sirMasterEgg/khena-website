"use client";

import {useState} from "react";
import Image from "next/image";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import {cn} from "@/presentation/lib/cn";

export type RemoteImageProps = {
  /** Boleh undefined — CMS belum diisi, langsung jatuh ke placeholder. */
  src?: string;
  alt: string;
  /** Teks untuk PlaceholderImage saat fallback. */
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Slot gambar konten CMS — bagian Fase 2 issue #27. `src` bisa `undefined`
 * (belum diisi) atau URL-nya mati; keduanya jatuh ke `PlaceholderImage`,
 * bukan icon broken image, supaya landing tidak pernah rusak karena konten
 * CMS yang belum lengkap.
 *
 * Pembungkus dari pemanggil harus `relative` + `overflow-hidden` supaya
 * `fill` bekerja — rasio/tinggi tetap diatur lewat className di sana.
 */
export function RemoteImage({src, alt, label, className, sizes, priority}: RemoteImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <PlaceholderImage label={label} className={className} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}
