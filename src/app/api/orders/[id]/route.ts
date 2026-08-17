import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { isDashboardAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isDashboardAuthenticated())) {
    return Response.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const result = await db.select().from(orders).where(eq(orders.id, Number(id))).limit(1);
    if (!result.length) return Response.json({ error: "الطلب غير موجود" }, { status: 404 });
    return Response.json({ order: result[0] });
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
    
    // Only allow updating specific fields
    const updateData: Partial<typeof orders.$inferInsert> = {};
    if (body.status) updateData.status = body.status;
    if (body.customerName) updateData.customerName = body.customerName;
    if (body.phone) updateData.phone = body.phone;
    if (body.wilaya) updateData.wilaya = body.wilaya;
    if (body.commune) updateData.commune = body.commune;
    if (body.address) updateData.address = body.address;

    const [updated] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, Number(id)))
      .returning();

    if (!updated) return Response.json({ error: "الطلب غير موجود" }, { status: 404 });
    return Response.json({ order: updated });
  } catch {
    return Response.json({ error: "تعذر تحديث الطلب" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isDashboardAuthenticated())) {
    return Response.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const [deleted] = await db.delete(orders).where(eq(orders.id, Number(id))).returning();
    if (!deleted) return Response.json({ error: "الطلب غير موجود" }, { status: 404 });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "تعذر حذف الطلب" }, { status: 500 });
  }
}
