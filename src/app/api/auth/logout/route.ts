import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "تعذر تسجيل الخروج" }, { status: 500 });
  }
}
