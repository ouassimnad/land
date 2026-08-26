import { eq } from "drizzle-orm";
import { db } from "@/db";
import { storeSettings } from "@/db/schema";

export type BrandAssets = { logo: string; hero: string };

// يجلب لوغو المتجر والهيرو من إعدادات الهوية (لوحة التحكم)
export async function getBrandAssets(): Promise<BrandAssets> {
  try {
    const [row] = await db.select().from(storeSettings).where(eq(storeSettings.id, 1)).limit(1);
    return { logo: row?.logo?.trim() ?? "", hero: row?.hero?.trim() ?? "" };
  } catch {
    return { logo: "", hero: "" };
  }
}
