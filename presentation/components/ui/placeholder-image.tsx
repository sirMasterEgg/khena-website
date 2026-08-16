import {cn} from "@/presentation/lib/cn";

/**
 * Rasio gambar yang dipakai di desain (bagian 4.x issue.md). Dikelola sebagai
 * pemetaan literal supaya kelas `aspect-[...]` tetap terdeteksi Tailwind (nilai
 * dinamis hasil interpolasi string tidak akan ter-scan) — lihat pengecualian
 * arbitrary value di bagian 0.3.
 */
const ASPECT_CLASSES = {
  "383/468": "aspect-[383/468]",
  "383/384": "aspect-[383/384]",
  "1114/468": "aspect-[1114/468]",
  "1420/618": "aspect-[1420/618]",
  "1420/468": "aspect-[1420/468]",
  "820/468": "aspect-[820/468]",
  "665/365": "aspect-[665/365]",
  square: "aspect-square",
  video: "aspect-video",
} as const;

export type PlaceholderAspect = keyof typeof ASPECT_CLASSES;

export type PlaceholderImageProps = {
  label?: string;
  aspect?: PlaceholderAspect;
  className?: string;
};

/** Placeholder untuk seluruh slot gambar sampai aset asli tersedia — bagian 2.6. */
export function PlaceholderImage({label, aspect, className}: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-tile p-2 text-center text-xs text-muted",
        aspect && ASPECT_CLASSES[aspect],
        className
      )}
    >
      {label ? <span>{label}</span> : null}
    </div>
  );
}
