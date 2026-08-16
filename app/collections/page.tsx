import type {Metadata} from "next";
import {getVisibleCollections} from "@/application/use-cases/get-visible-collections";
import {getLiveProducts} from "@/application/use-cases/get-live-products";
import {Container} from "@/presentation/components/ui/container";
import {Eyebrow} from "@/presentation/components/ui/eyebrow";
import {CollectionCard} from "@/presentation/components/product/collection-card";

export const metadata: Metadata = {
  title: "Signature Collections",
  description: "Explore Khena's signature furniture collections.",
};

export default async function CollectionsPage() {
  const [collections, liveProducts] = await Promise.all([
    getVisibleCollections(),
    getLiveProducts(),
  ]);

  return (
    <Container>
      <div className="mx-auto max-w-190 pt-20 text-center">
        <Eyebrow>Our Collections</Eyebrow>
        <h1 className="mt-4 font-display text-h1">Signature Collections</h1>
        <p className="mt-4 text-body-lg text-muted">
          Each collection is a considered set of pieces, designed to be lived with for years to
          come.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 py-15 sm:grid-cols-2 lg:grid-cols-3 lg:py-30">
        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            pieceCount={liveProducts.filter((p) => p.collection === collection.slug).length}
          />
        ))}
      </div>
    </Container>
  );
}
