import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { isDashboardAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await db.select().from(products).where(eq(products.id, Number(id))).limit(1);
    if (!result.length) return Response.json({ error: "المنتج غير موجود" }, { status: 404 });
    return Response.json({ product: result[0] });
  } catch {
    return Response.json({ error: "تعذر الاتصال بقاعدة البيانات" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isDashboardAuthenticated())) {
    return Response.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updateData: Partial<typeof products.$inferInsert> = {};
    if (body.nameFr !== undefined) updateData.nameFr = String(body.nameFr).trim();
    if (body.nameAr !== undefined) updateData.nameAr = String(body.nameAr).trim();
    if (body.price !== undefined) updateData.price = String(body.price);
    if (body.deliveryPrice !== undefined) updateData.deliveryPrice = body.deliveryPrice ? String(body.deliveryPrice) : null;
    if (body.discount !== undefined) updateData.discount = body.discount ? Number(body.discount) : null;
    if (body.descriptionFr !== undefined) updateData.descriptionFr = String(body.descriptionFr).trim();
    if (body.descriptionAr !== undefined) updateData.descriptionAr = String(body.descriptionAr).trim();
    if (body.images !== undefined) updateData.images = Array.isArray(body.images) ? body.images : [];
    if (body.colors !== undefined) updateData.colors = Array.isArray(body.colors) ? body.colors : [];
    if (body.sizes !== undefined) updateData.sizes = Array.isArray(body.sizes) ? body.sizes : [];
    if (body.category !== undefined) updateData.category = body.category && String(body.category).trim() ? String(body.category).trim() : null;

    const [updated] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, Number(id)))
      .returning();

    if (!updated) return Response.json({ error: "المنتج غير موجود" }, { status: 404 });
    return Response.json({ product: updated });
  } catch {
    return Response.json({ error: "تعذر تحديث المنتج" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isDashboardAuthenticated())) {
    return Response.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const [deleted] = await db.delete(products).where(eq(products.id, Number(id))).returning();
    if (!deleted) return Response.json({ error: "المنتج غير موجود" }, { status: 404 });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "تعذر حذف المنتج" }, { status: 500 });
  }
}
