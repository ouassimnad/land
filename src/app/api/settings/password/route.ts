import { getCurrentSession, getSupabaseAuthConfig } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return Response.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const config = getSupabaseAuthConfig();
    if (!config) {
      return Response.json({ error: "إعدادات Supabase غير مكتملة" }, { status: 500 });
    }
    const body = (await request.json()) as { password?: string; confirmPassword?: string };
    if (!body.password || body.password.length < 8) {
      return Response.json({ error: "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل" }, { status: 400 });
    }
    if (body.password !== body.confirmPassword) {
      return Response.json({ error: "كلمتا المرور غير متطابقتين" }, { status: 400 });
    }

    // تغيير كلمة المرور في حساب Supabase للمستخدم المتصل
    const res = await fetch(`${config.url}/auth/v1/user`, {
      method: "PUT",
      headers: {
        apikey: config.key,
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ password: body.password }),
    });
    if (!res.ok) {
      return Response.json({ error: "تعذر تحديث كلمة المرور" }, { status: 400 });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "تعذر تحديث كلمة المرور" }, { status: 500 });
  }
}
