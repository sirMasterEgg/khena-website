import type {Metadata} from "next";
import {getPublishedCategories} from "@/application/use-cases/get-published-categories";
import {getLiveProducts} from "@/application/use-cases/get-live-products";
import {Container} from "@/presentation/components/ui/container";
import {Eyebrow} from "@/presentation/components/ui/eyebrow";
import {CategoryCard} from "@/presentation/components/product/category-card";

export const metadata: Metadata = {
  title: "Shop by Category",
  description: "Browse Khena furniture by category.",
};

export default async function CategoriesPage() {
  const [categories, liveProducts] = await Promise.all([
    getPublishedCategories(),
    getLiveProducts(),
  ]);

  return (
    <Container>
      <div className="mx-auto max-w-190 pt-20 text-center">
        <Eyebrow>Shop by Room</Eyebrow>
        <h1 className="mt-4 font-display text-h1">Categories</h1>
        <p className="mt-4 text-body-lg text-muted">
          From sofas to bed frames — find the piece that fits your space.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 py-15 sm:grid-cols-2 lg:grid-cols-3 lg:py-30">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            pieceCount={liveProducts.filter((p) => p.category === category.slug).length}
          />
        ))}
      </div>
    </Container>
  );
}
