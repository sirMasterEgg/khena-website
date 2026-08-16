import Link from "next/link";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import type {Category} from "@/domain/entities/category";

export type CategoryCardProps = {
  category: Category;
  pieceCount: number;
};

/** Kartu kategori — teks di atas gambar, kiri-bawah (bagian 4.3 issue.md). */
export function CategoryCard({category, pieceCount}: CategoryCardProps) {
  return (
    <Link href={`/shop?category=${category.slug}`} className="block">
      <div className="relative aspect-[383/468] overflow-hidden">
        <PlaceholderImage />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute bottom-5.5 left-6 text-invert">
          <p className="font-display text-4xl text-shadow-md">{category.name}</p>
          <p className="mt-1 text-sm">{pieceCount} Pieces</p>
        </div>
      </div>
      <p className="mx-auto mt-4 max-w-70 text-center text-sm text-muted">{category.blurb}</p>
    </Link>
  );
}
