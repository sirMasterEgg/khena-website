import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getProductDetail} from "@/application/use-cases/get-product-detail";
import {getRelatedProductSummaries} from "@/application/use-cases/get-related-product-summaries";
import {ProductDetailView} from "@/presentation/components/product/product-detail";

type ProductPageProps = {
  // `params` berupa Promise di versi Next ini — lihat dynamic-routes.md.
  params: Promise<{sku: string}>;
};

export async function generateMetadata({params}: ProductPageProps): Promise<Metadata> {
  const {sku} = await params;
  const product = await getProductDetail(sku);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({params}: ProductPageProps) {
  const {sku} = await params;

  const product = await getProductDetail(sku);
  if (!product) notFound();

  const relatedProducts = await getRelatedProductSummaries(product.sku);

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}
