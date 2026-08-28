import type {Metadata} from "next";
import {getCollectionCatalog} from "@/application/use-cases/get-collection-catalog";
import type {CollectionCatalogPage} from "@/domain/repositories/collection-catalog-repository";
import {Container} from "@/presentation/components/ui/container";
import {Eyebrow} from "@/presentation/components/ui/eyebrow";
import {CollectionCard} from "@/presentation/components/product/collection-card";
import {ShopPagination} from "@/presentation/components/shop/shop-pagination";
import {RevealStagger} from "@/presentation/components/motion/reveal-stagger";

export const metadata: Metadata = {
  title: "Signature Collections",
  description: "Explore Khena's signature furniture collections.",
};

type CollectionsSearchParams = {[key: string]: string | string[] | undefined};

/** `?page=abc` atau di luar jangkauan tidak boleh sampai ke backend sebagai string mentah — jatuh ke 1. */
function parsePageParam(value: string | string[] | undefined): number {
  const raw = typeof value === "string" ? Number(value) : NaN;
  return Number.isInteger(raw) && raw >= 1 ? raw : 1;
}

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<CollectionsSearchParams>;
}) {
  const params = await searchParams;
  const page = parsePageParam(params.page);

  let catalog: CollectionCatalogPage | null = null;
  try {
    catalog = await getCollectionCatalog({page});
  } catch (error) {
    console.error("[collections] gagal memuat koleksi", error);
  }

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

      <div className="py-15 lg:py-30">
        {catalog === null ? (
          <p className="py-20 text-center text-sm text-muted">
            Collections are unavailable right now. Please try again shortly.
          </p>
        ) : catalog.items.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted">No collections available yet.</p>
        ) : (
          <>
            <RevealStagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {catalog.items.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </RevealStagger>

            <ShopPagination meta={catalog.meta} searchParams={params} pathname="/collections" />
          </>
        )}
      </div>
    </Container>
  );
}
