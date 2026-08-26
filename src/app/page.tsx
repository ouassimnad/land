import { desc, eq, type InferSelectModel } from "drizzle-orm";
import { db } from "@/db";
import { products, reviews, socialSettings, storeSettings } from "@/db/schema";
import StoreGrid from "@/components/StoreGrid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let activeProducts: InferSelectModel<typeof products>[] = [];
  let reviewImages: InferSelectModel<typeof reviews>[] = [];
  let social: InferSelectModel<typeof socialSettings> | null = null;
  let brand: InferSelectModel<typeof storeSettings> | null = null;

  try {
    activeProducts = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt));
  } catch (e) {
    console.error("Failed to fetch products", e);
  }

  try {
    reviewImages = await db
      .select()
      .from(reviews)
      .orderBy(desc(reviews.createdAt));
  } catch (e) {
    console.error("Failed to fetch reviews", e);
  }

  try {
    const [row] = await db.select().from(socialSettings).where(eq(socialSettings.id, 1)).limit(1);
    social = row ?? null;
  } catch (e) {
    console.error("Failed to fetch social links", e);
  }

  try {
    const [row] = await db.select().from(storeSettings).where(eq(storeSettings.id, 1)).limit(1);
    brand = row ?? null;
  } catch (e) {
    console.error("Failed to fetch brand assets", e);
  }

  return <StoreGrid products={activeProducts} reviews={reviewImages} social={social} brand={brand} />;
}
