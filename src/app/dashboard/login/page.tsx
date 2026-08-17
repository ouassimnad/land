"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "تعذر تسجيل الدخول");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تسجيل الدخول");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fffaf8] px-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img alt="Clochette logo" src="/logo.png" className="h-16 w-16 rounded-full object-cover" />
          <h1 className="mt-4 text-2xl font-bold text-[#617549]">لوحة تحكم Clochette</h1>
          <p className="mt-2 text-sm text-[#857d76]">سجلي الدخول ببيانات حسابك للوصول إلى إدارة المتجر</p>
        </div>

        <form onSubmit={submitLogin} className="rounded-2xl border border-[#e8e2dc] bg-white p-6 shadow-sm">
          <label className="mb-1 block text-sm font-medium text-[#2a2522]" htmlFor="admin-email">البريد الإلكتروني</label>
          <input
            id="admin-email"
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
            className="w-full rounded-lg border border-[#d8cfc6] bg-white px-4 py-3 text-sm text-[#2a2522] outline-none transition-colors focus:border-[#617549]"
          />
          <label className="mt-4 mb-1 block text-sm font-medium text-[#2a2522]" htmlFor="admin-password">كلمة المرور</label>
          <input
            id="admin-password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-[#d8cfc6] bg-white px-4 py-3 text-sm text-[#2a2522] outline-none transition-colors focus:border-[#617549]"
          />
          {error && <p className="mt-3 text-center text-xs font-medium text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-5 w-full rounded-full bg-[#617549] px-5 py-3 text-sm font-bold text-[#fffaf8] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? "جارٍ الدخول..." : "تسجيل الدخول"}
          </button>
          <p className="mt-4 text-center text-[11px] text-[#857d76]">الدخول يتم عبر حساب Supabase Authentication الخاص بالمتجر.</p>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-xs font-medium text-[#617549] hover:underline">← العودة إلى المتجر</a>
        </div>
      </div>
    </div>
  );
}
