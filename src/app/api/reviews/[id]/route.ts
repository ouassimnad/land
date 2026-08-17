import { eq } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { isDashboardAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isDashboardAuthenticated())) {
    return Response.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const [deleted] = await db.delete(reviews).where(eq(reviews.id, Number(id))).returning();
    if (!deleted) return Response.json({ error: "الصورة غير موجودة" }, { status: 404 });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "تعذر حذف الصورة" }, { status: 500 });
  }
}
