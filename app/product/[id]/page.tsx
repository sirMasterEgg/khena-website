import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getProductById} from "@/application/use-cases/get-product-by-id";
import {getRelatedProducts} from "@/application/use-cases/get-related-products";
import {getVisibleCollections} from "@/application/use-cases/get-visible-collections";
import {ProductDetail} from "@/presentation/components/product/product-detail";

type ProductPageProps = {
  params: Promise<{id: string}>;
};

export async function generateMetadata({params}: ProductPageProps): Promise<Metadata> {
  const {id} = await params;
  const product = await getProductById(id);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({params}: ProductPageProps) {
  const {id} = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const [relatedProducts, collections] = await Promise.all([
    getRelatedProducts(product),
    getVisibleCollections(),
  ]);

  const collection = collections.find((c) => c.slug === product.collection);

  return (
    <ProductDetail product={product} collection={collection} relatedProducts={relatedProducts} />
  );
}
