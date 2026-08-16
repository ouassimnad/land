import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import Storefront from "./storefront";
import { PRODUCT as STATIC_PRODUCT } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let finalProduct = STATIC_PRODUCT;
  
  try {
    const [activeProduct] = await db
      .select()
      .from(products)
      .where(eq(products.active, true))
      .orderBy(desc(products.createdAt))
      .limit(1);

    if (activeProduct) {
      finalProduct = {
        name: { ar: activeProduct.name, fr: activeProduct.name },
        subtitle: STATIC_PRODUCT.subtitle,
        price: Number(activeProduct.price),
        oldPrice: activeProduct.oldPrice ? Number(activeProduct.oldPrice) : STATIC_PRODUCT.oldPrice,
        delivery: STATIC_PRODUCT.delivery,
        currency: "دج",
        colors: STATIC_PRODUCT.colors, // Keeping static colors for now since DB only stores string[]
        sizes: activeProduct.sizes && activeProduct.sizes.length > 0 ? activeProduct.sizes : STATIC_PRODUCT.sizes,
        images: activeProduct.image ? [activeProduct.image] : STATIC_PRODUCT.images,
        description: { ar: activeProduct.description, fr: activeProduct.description },
      } as typeof STATIC_PRODUCT;
    }
  } catch (e) {
    console.error("Failed to fetch product", e);
  }

  return <Storefront productData={finalProduct} />;
}
