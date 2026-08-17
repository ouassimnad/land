import { desc } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { isDashboardAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await db.select().from(reviews).orderBy(desc(reviews.createdAt));
    return Response.json({ reviews: result });
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
    if (!body.image || !String(body.image).trim()) {
      return Response.json({ error: "الصورة مطلوبة" }, { status: 400 });
    }

    const [review] = await db
      .insert(reviews)
      .values({ image: String(body.image).trim() })
      .returning();

    return Response.json({ review }, { status: 201 });
  } catch (e) {
    console.error("Review save error:", e);
    return Response.json({ error: "تعذر حفظ الصورة" }, { status: 500 });
  }
}
