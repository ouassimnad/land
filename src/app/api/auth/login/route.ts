import { cookies } from "next/headers";
import { SESSION_COOKIE, getSupabaseAuthConfig } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const config = getSupabaseAuthConfig();
    if (!config) {
      return Response.json({ error: "إعدادات Supabase غير مكتملة" }, { status: 500 });
    }

    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email || !body.password) {
      return Response.json({ error: "أدخلي البريد الإلكتروني وكلمة المرور" }, { status: 400 });
    }

    // تسجيل الدخول عبر Supabase Authentication
    const res = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: config.key, "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email.trim(), password: body.password }),
    });
    if (!res.ok) {
      return Response.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    const data = (await res.json()) as { access_token?: string; refresh_token?: string; expires_in?: number };
    if (!data.access_token || !data.refresh_token) {
      return Response.json({ error: "تعذر تسجيل الدخول" }, { status: 401 });
    }

    const session = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + Number(data.expires_in ?? 3600) * 1000,
    };
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "تعذر تسجيل الدخول" }, { status: 500 });
  }
}
