import { eq } from "drizzle-orm";
import { db } from "@/db";
import { socialSettings } from "@/db/schema";
import { isDashboardAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export type SocialLinks = { instagram: string; facebook: string; tiktok: string };

// GET عام: المتجر يعرض روابط التواصل في الفوتر
export async function GET() {
  try {
    const [row] = await db.select().from(socialSettings).where(eq(socialSettings.id, 1)).limit(1);
    const links: SocialLinks = {
      instagram: row?.instagram ?? "",
      facebook: row?.facebook ?? "",
      tiktok: row?.tiktok ?? "",
    };
    return Response.json({ links });
  } catch {
    return Response.json({ error: "تعذر تحميل روابط التواصل الاجتماعي" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isDashboardAuthenticated())) {
    return Response.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as Partial<SocialLinks>;
    const links: SocialLinks = {
      instagram: String(body.instagram ?? "").trim(),
      facebook: String(body.facebook ?? "").trim(),
      tiktok: String(body.tiktok ?? "").trim(),
    };
    await db
      .insert(socialSettings)
      .values({ id: 1, ...links })
      .onConflictDoUpdate({ target: socialSettings.id, set: links });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "تعذر حفظ روابط التواصل الاجتماعي" }, { status: 500 });
  }
}
