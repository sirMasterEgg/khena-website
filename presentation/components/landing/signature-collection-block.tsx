import {RemoteImage} from "@/presentation/components/ui/remote-image";
import type {SignatureCollectionContent} from "@/domain/entities/landing-content";

/**
 * Varian "block" Signature Collection — satu judul + satu gambar dari CMS,
 * bagian Fase 5 issue #27. Server Component (tanpa state) — struktur & spasi
 * visual mengikuti `CollectionCarousel` supaya ritme halaman tidak berubah.
 * Tanpa panah/dot/auto-play/link — struktur CMS section ini tidak menyediakan
 * slug tujuan (lihat Pertanyaan Terbuka #1 di issue.md).
 */
export function SignatureCollectionBlock({content}: {content: SignatureCollectionContent}) {
  return (
    <section className="pt-27.5">
      <div className="mx-auto max-w-355 px-6 text-center">
        <h2 className="font-display text-h3">{content.title}</h2>
      </div>

      <div className="mx-auto mt-8 max-w-355 px-6">
        <div className="relative aspect-[1114/468] overflow-hidden">
          <RemoteImage src={content.image.url} alt={content.image.alt} label={content.title} sizes="100vw" />
        </div>
      </div>
    </section>
  );
}
