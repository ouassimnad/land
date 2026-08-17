import { db } from "@/db";
import { deliveryPrices } from "@/db/schema";
import { isDashboardAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export type DeliveryPriceEntry = { home: number; office: number };

// GET عام: صفحة السلة تحتاج أسعار التوصيل لعرضها للزبونة
export async function GET() {
  try {
    const rows = await db.select().from(deliveryPrices);
    const prices: Record<string, DeliveryPriceEntry> = {};
    for (const row of rows) {
      prices[row.wilaya] = { home: Number(row.homePrice), office: Number(row.officePrice) };
    }
    return Response.json({ prices });
  } catch {
    return Response.json({ error: "تعذر تحميل أسعار التوصيل" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isDashboardAuthenticated())) {
    return Response.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { prices?: Record<string, Partial<DeliveryPriceEntry>> };
    if (!body.prices || typeof body.prices !== "object") {
      return Response.json({ error: "بيانات غير صالحة" }, { status: 400 });
    }
    for (const [wilaya, entry] of Object.entries(body.prices)) {
      const home = Number(entry?.home);
      const office = Number(entry?.office);
      const homeText = Number.isFinite(home) && home >= 0 ? home.toFixed(2) : "0.00";
      const officeText = Number.isFinite(office) && office >= 0 ? office.toFixed(2) : "0.00";
      if (!wilaya) continue;
      await db
        .insert(deliveryPrices)
        .values({ wilaya, homePrice: homeText, officePrice: officeText })
        .onConflictDoUpdate({ target: deliveryPrices.wilaya, set: { homePrice: homeText, officePrice: officeText } });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "تعذر حفظ أسعار التوصيل" }, { status: 500 });
  }
}
