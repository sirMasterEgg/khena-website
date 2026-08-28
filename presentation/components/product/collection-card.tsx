import Link from "next/link";
import {RemoteImage} from "@/presentation/components/ui/remote-image";
import type {CollectionSummary} from "@/domain/entities/collection-summary";

export type CollectionCardProps = {
  collection: CollectionSummary;
};

/** Kartu koleksi — teks di bawah gambar, rata tengah (bagian 4.2 desain). */
export function CollectionCard({collection}: CollectionCardProps) {
  return (
    <Link href={`/shop?collection=${collection.slug}`} className="block">
      {/* `relative` + `overflow-hidden` wajib supaya <Image fill> di RemoteImage bekerja. */}
      <div className="relative aspect-[383/468] overflow-hidden">
        <RemoteImage
          src={collection.coverImage}
          alt={collection.name}
          label={collection.name}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        {/* API hanya memberi tahu ADA item habis di koleksi ini, bukan bahwa
            seluruh koleksi habis — teks badge tetap "Restocking" (D5). */}
        {collection.hasSoldOutProduct ? (
          <span className="absolute left-4 top-4 bg-ink/82 px-2 py-1 text-xs uppercase tracking-label text-invert">
            Restocking
          </span>
        ) : null}
      </div>
      <div className="mt-4 text-center">
        <p className="text-xs uppercase tracking-eyebrow text-muted">
          {collection.totalProducts} Pieces
        </p>
        <p className="mt-2 font-display text-2xl">{collection.name}</p>
      </div>
    </Link>
  );
}
