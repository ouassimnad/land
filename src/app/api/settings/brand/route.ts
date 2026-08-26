import { eq } from "drizzle-orm";
import { db } from "@/db";
import { storeSettings } from "@/db/schema";
import { isDashboardAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export type BrandAssets = { logo: string; hero: string };

// GET عام: المتجر يعرض اللوغو والهيرو من الإعدادات
export async function GET() {
  try {
    const [row] = await db.select().from(storeSettings).where(eq(storeSettings.id, 1)).limit(1);
    const brand: BrandAssets = {
      logo: row?.logo ?? "",
      hero: row?.hero ?? "",
    };
    return Response.json({ brand });
  } catch {
    return Response.json({ error: "تعذر تحميل إعدادات الهوية" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isDashboardAuthenticated())) {
    return Response.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as Partial<BrandAssets>;
    const brand: BrandAssets = {
      logo: String(body.logo ?? "").trim(),
      hero: String(body.hero ?? "").trim(),
    };
    await db
      .insert(storeSettings)
      .values({ id: 1, ...brand })
      .onConflictDoUpdate({ target: storeSettings.id, set: brand });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "تعذر حفظ إعدادات الهوية" }, { status: 500 });
  }
}
