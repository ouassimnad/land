import { desc } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { isDashboardAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await db.select().from(products).orderBy(desc(products.createdAt));
    return Response.json({ products: result });
  } catch {
    return Response.json({ error: "تعذر الاتصال بقاعدة البيانات" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isDashboardAuthenticated())) {
    return Response.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const required = [body.nameFr, body.nameAr, body.price, body.descriptionFr, body.descriptionAr];
    if (required.some((value) => !value || !String(value).trim())) {
      return Response.json({ error: "الرجاء إكمال جميع المعلومات المطلوبة للمنتج" }, { status: 400 });
    }

    const [product] = await db.insert(products).values({
      nameFr: String(body.nameFr).trim(),
      nameAr: String(body.nameAr).trim(),
      price: String(body.price),
      deliveryPrice: body.deliveryPrice ? String(body.deliveryPrice) : null,
      discount: body.discount ? Number(body.discount) : null,
      descriptionFr: String(body.descriptionFr).trim(),
      descriptionAr: String(body.descriptionAr).trim(),
      images: Array.isArray(body.images) ? body.images : [],
      colors: Array.isArray(body.colors) ? body.colors : [],
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      category: body.category && String(body.category).trim() ? String(body.category).trim() : null,
    }).returning();

    return Response.json({ product }, { status: 201 });
  } catch (e: any) {
    console.error("Product save error:", e);
    return Response.json({ error: "تعذر حفظ المنتج" }, { status: 500 });
  }
}
