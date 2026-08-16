import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";

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
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updateData: Partial<typeof products.$inferInsert> = {};
    if (body.name !== undefined) updateData.name = String(body.name).trim();
    if (body.price !== undefined) updateData.price = String(body.price);
    if (body.oldPrice !== undefined) updateData.oldPrice = body.oldPrice ? String(body.oldPrice) : null;
    if (body.description !== undefined) updateData.description = String(body.description).trim();
    if (body.image !== undefined) updateData.image = String(body.image).trim();
    if (body.colors !== undefined) updateData.colors = Array.isArray(body.colors) ? body.colors : [];
    if (body.sizes !== undefined) updateData.sizes = Array.isArray(body.sizes) ? body.sizes : [];
    if (body.active !== undefined) updateData.active = Boolean(body.active);

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
  try {
    const { id } = await params;
    const [deleted] = await db.delete(products).where(eq(products.id, Number(id))).returning();
    if (!deleted) return Response.json({ error: "المنتج غير موجود" }, { status: 404 });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "تعذر حذف المنتج" }, { status: 500 });
  }
}
