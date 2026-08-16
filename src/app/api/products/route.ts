import { desc } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";

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
  try {
    const body = await request.json();
    const required = [body.name, body.price, body.description, body.image];
    if (required.some((value) => !value || !String(value).trim())) {
      return Response.json({ error: "الرجاء إكمال جميع المعلومات المطلوبة للمنتج" }, { status: 400 });
    }

    const [product] = await db.insert(products).values({
      name: String(body.name).trim(),
      price: String(body.price),
      oldPrice: body.oldPrice ? String(body.oldPrice) : null,
      description: String(body.description).trim(),
      image: String(body.image).trim(),
      colors: Array.isArray(body.colors) ? body.colors : [],
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      active: body.active !== undefined ? Boolean(body.active) : true,
    }).returning();

    return Response.json({ product }, { status: 201 });
  } catch (e: any) {
    console.error("Product save error:", e);
    return Response.json({ error: "تعذر حفظ المنتج" }, { status: 500 });
  }
}
