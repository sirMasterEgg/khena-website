import Link from "next/link";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import type {Collection} from "@/domain/entities/collection";

export type CollectionCardProps = {
  collection: Collection;
  pieceCount: number;
};

/** Kartu koleksi — teks di bawah gambar, rata tengah (bagian 4.2 issue.md). */
export function CollectionCard({collection, pieceCount}: CollectionCardProps) {
  return (
    <Link href={`/shop?collection=${collection.slug}`} className="block">
      <div className="relative aspect-[383/468] overflow-hidden">
        <PlaceholderImage label={collection.name} />
        {collection.status === "outofstock" ? (
          <span className="absolute left-4 top-4 bg-ink/82 px-2 py-1 text-xs uppercase tracking-label text-invert">
            Restocking
          </span>
        ) : null}
      </div>
      <div className="mt-4 text-center">
        <p className="text-xs uppercase tracking-eyebrow text-muted">{pieceCount} Pieces</p>
        <p className="mt-2 font-display text-2xl">{collection.name}</p>
        <p className="mx-auto mt-2 max-w-70 text-sm text-muted">{collection.description}</p>
      </div>
    </Link>
  );
}
