import HomePageClient from "@/components/HomePageClient";
import { products as fallbackProducts } from "@/data/products";
import { getProducts } from "@/lib/shopify";

export const dynamic = "force-dynamic";

export default async function Home() {
  let products = fallbackProducts;

  try {
    const shopifyProducts = await getProducts();
    products = shopifyProducts.length > 0 ? shopifyProducts : fallbackProducts;
  } catch (error) {
    console.warn("Using fallback products because Shopify fetch failed:", error);
  }

  return <HomePageClient products={products} />;
}
