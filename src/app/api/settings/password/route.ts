import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminSettings } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string; confirmPassword?: string };
    if (!body.password || body.password.length < 8) {
      return Response.json({ error: "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل" }, { status: 400 });
    }
    if (body.password !== body.confirmPassword) {
      return Response.json({ error: "كلمتا المرور غير متطابقتين" }, { status: 400 });
    }
    const passwordHash = createHash("sha256").update(body.password).digest("hex");
    await db.insert(adminSettings).values({ id: 1, passwordHash }).onConflictDoUpdate({
      target: adminSettings.id,
      set: { passwordHash, updatedAt: new Date() },
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "تعذر تحديث كلمة المرور" }, { status: 500 });
  }
}
