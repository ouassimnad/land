import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import Storefront from "@/app/storefront";
import { PRODUCT as STATIC_PRODUCT } from "@/lib/catalog";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type ProductShape = typeof STATIC_PRODUCT;

function normalizeColors(raw: unknown): ProductShape["colors"] {
  if (!Array.isArray(raw) || raw.length === 0) return STATIC_PRODUCT.colors;
  return raw.map((entry) => {
    if (entry && typeof entry === "object" && "value" in entry) {
      return entry as ProductShape["colors"][number];
    }
    const label = String(entry);
    return { ar: label, fr: label, value: label, image: "" } as ProductShape["colors"][number];
  });
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    notFound();
  }

  let finalProduct = STATIC_PRODUCT;
  
  try {
    const [dbProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!dbProduct) {
      notFound();
    }

    const price = Number(dbProduct.price);
    const discount = dbProduct.discount ?? 0;
    const oldPrice = discount > 0 ? Math.round(price / (1 - discount / 100)) : price;
    const delivery = dbProduct.deliveryPrice ? Number(dbProduct.deliveryPrice) : STATIC_PRODUCT.delivery;

    finalProduct = {
      name: { ar: dbProduct.nameAr, fr: dbProduct.nameFr },
      subtitle: STATIC_PRODUCT.subtitle,
      price,
      oldPrice,
      delivery,
      currency: "دج",
      colors: normalizeColors(dbProduct.colors),
      sizes: dbProduct.sizes && dbProduct.sizes.length > 0 ? dbProduct.sizes : STATIC_PRODUCT.sizes,
      images: dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images : STATIC_PRODUCT.images,
      description: { ar: dbProduct.descriptionAr, fr: dbProduct.descriptionFr },
    } as ProductShape;
  } catch (e) {
    console.error("Failed to fetch product", e);
    notFound();
  }

  return <Storefront productData={finalProduct} productId={productId} />;
}
