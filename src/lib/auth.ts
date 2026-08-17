import { cookies } from "next/headers";

export const SESSION_COOKIE = "clochette_admin";

export type AdminSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch ms
};

export function getSupabaseAuthConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export function parseSession(raw: string | undefined): AdminSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<AdminSession>;
    if (!parsed.accessToken || !parsed.refreshToken || typeof parsed.expiresAt !== "number") return null;
    return { accessToken: parsed.accessToken, refreshToken: parsed.refreshToken, expiresAt: parsed.expiresAt };
  } catch {
    return null;
  }
}

async function refreshSession(config: { url: string; key: string }, session: AdminSession): Promise<AdminSession | null> {
  const res = await fetch(`${config.url}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { apikey: config.key, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: session.refreshToken }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string; refresh_token?: string; expires_in?: number };
  if (!data.access_token) return null;
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? session.refreshToken,
    expiresAt: Date.now() + Number(data.expires_in ?? 3600) * 1000,
  };
}

// يجلب جلسة Supabase صالحة إن وجدت (مع تجديد التوكن عند انتهاء صلاحيته)
export async function getCurrentSession(): Promise<AdminSession | null> {
  try {
    const config = getSupabaseAuthConfig();
    if (!config) return null;
    const cookieStore = await cookies();
    let session = parseSession(cookieStore.get(SESSION_COOKIE)?.value);
    if (!session) return null;

    // توكن Supabase صالح لساعة تقريباً — نجدده تلقائياً قبل انتهاء صلاحيته
    if (Date.now() >= session.expiresAt - 60_000) {
      const refreshed = await refreshSession(config, session);
      if (!refreshed) return null;
      session = refreshed;
      cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    const res = await fetch(`${config.url}/auth/v1/user`, {
      headers: { apikey: config.key, Authorization: `Bearer ${session.accessToken}` },
    });
    return res.ok ? session : null;
  } catch {
    return null;
  }
}

export async function isDashboardAuthenticated(): Promise<boolean> {
  return (await getCurrentSession()) !== null;
}
