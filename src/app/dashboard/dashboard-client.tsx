"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { WILAYAS, formatPrice } from "@/lib/catalog";

type DashboardTab = "overview" | "products" | "reviews" | "orders" | "delivery" | "settings";
type DBReview = {
  id: number;
  image: string;
  createdAt: string;
};
type Order = {
  id: number;
  customerName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  quantity: number;
  color: string;
  size: string;
  unitPrice: string | number;
  deliveryPrice: string | number;
  totalPrice: string | number;
  status: string;
  createdAt: string;
};

type ColorEntry = string | { ar: string; fr: string; value: string; image: string };

type DBProduct = {
  id: number;
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
  descriptionAr: string;
  price: string | number;
  deliveryPrice: string | number | null;
  discount: number | null;
  images: string[];
  colors: ColorEntry[];
  sizes: string[];
  category: string | null;
};

type ProductFormState = {
  id?: number;
  nameAr: string;
  nameFr: string;
  price: string | number;
  discount: string | number;
  descriptionAr: string;
  descriptionFr: string;
  images: string[];
  imageColors: string[];
  sizes: string[];
  category: string;
};

const EMPTY_PRODUCT_FORM: ProductFormState = {
  nameAr: "",
  nameFr: "",
  price: "",
  discount: "",
  descriptionAr: "",
  descriptionFr: "",
  images: [],
  imageColors: [],
  sizes: [],
  category: "",
};

type IconName = "chart" | "box" | "star" | "list" | "gear" | "store" | "truck";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  let content: ReactNode;
  switch (name) {
    case "chart":
      content = <><path d="M3 3v18h18" /><path d="M7 15v3M12 10v8M17 6v12" /></>;
      break;
    case "box":
      content = <><path d="M21 8v8l-9 5-9-5V8l9-5 9 5Z" /><path d="m3 8 9 5 9-5M12 13v8" /></>;
      break;
    case "star":
      content = <><path d="m12 3 2.7 5.6 6.3.9-4.5 4.3 1 6.2L12 17l-5.5 3 1-6.2L3 9.5l6.3-.9L12 3Z" /></>;
      break;
    case "list":
      content = <><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="3.5" cy="6" r=".8" fill="currentColor" stroke="none" /><circle cx="3.5" cy="12" r=".8" fill="currentColor" stroke="none" /><circle cx="3.5" cy="18" r=".8" fill="currentColor" stroke="none" /></>;
      break;
    case "gear":
      content = <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" /></>;
      break;
    case "store":
      content = <><path d="M4 10v10h16V10" /><path d="M2 7l2-4h16l2 4a3 3 0 0 1-4 2.6A3 3 0 0 1 14 9a3 3 0 0 1-4 0 3 3 0 0 1-4 .6A3 3 0 0 1 2 7Z" /></>;
      break;
    case "truck":
      content = <><path d="M1.5 6h13v11h-13z" /><path d="M14.5 10h4l3 3v4h-7" /><circle cx="6" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></>;
      break;
  }
  return <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">{content}</svg>;
}

const TABS: { key: DashboardTab; label: string; icon: IconName }[] = [
  { key: "overview", label: "الإحصائيات", icon: "chart" },
  { key: "products", label: "المنتجات", icon: "box" },
  { key: "reviews", label: "آراء الزبونات", icon: "star" },
  { key: "orders", label: "الطلبات", icon: "list" },
  { key: "delivery", label: "أسعار التوصيل", icon: "truck" },
  { key: "settings", label: "الإعدادات", icon: "gear" },
];

function statusLabel(status: string) {
  if (status === "processing") return "قيد المعالجة";
  if (status === "delivered") return "تم التوصيل";
  return "جديد";
}

function statusStyle(status: string) {
  if (status === "processing") return "bg-[#f7ecf2] text-[#a1688a]";
  if (status === "delivered") return "bg-[#f1eeec] text-[#857d76]";
  return "bg-[#fdf2dd] text-[#bb8b3e]";
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium ${statusStyle(status)}`}>{statusLabel(status)}</span>;
}

function dateLabel(date: string) {
  return new Intl.DateTimeFormat("ar-DZ", { day: "numeric", month: "short" }).format(new Date(date));
}

function initials(name: string) {
  return name.trim().split(" ").slice(0, 2).map((item) => item[0]).join("");
}

const inputClass = "w-full rounded-lg border border-[#d8cfc6] bg-white px-3 py-2 text-sm text-[#2a2522] outline-none transition-colors focus:border-[#a1688a]";
const labelClass = "mb-1 block text-sm font-medium text-[#2a2522]";
const cardClass = "rounded-xl border border-[#e8e2dc] bg-white shadow-sm";
const primaryButtonClass = "rounded-full bg-[#a1688a] px-5 py-2.5 text-sm font-bold text-[#fffaf8] transition-opacity hover:opacity-90 disabled:opacity-60";

export default function DashboardClient() {
  const router = useRouter();
  const [tab, setTab] = useState<DashboardTab>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settingsMessage, setSettingsMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [dbProducts, setDbProducts] = useState<DBProduct[]>([]);
  const [dbReviews, setDbReviews] = useState<DBReview[]>([]);

  const fetchDashboardData = () => {
    fetch("/api/orders")
      .then(async (response) => {
        if (!response.ok) throw new Error("offline");
        return response.json() as Promise<{ orders: Order[] }>;
      })
      .then((data) => { setOrders(Array.isArray(data.orders) ? data.orders : []); })
      .catch(() => undefined)
      .finally(() => setLoading(false));

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => { if (data.products) setDbProducts(data.products); })
      .catch(() => undefined);

    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => { if (data.reviews) setDbReviews(data.reviews); })
      .catch(() => undefined);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const revenue = useMemo(() => orders.reduce((sum, order) => sum + Number(order.totalPrice), 0), [orders]);
  const processingCount = orders.filter((order) => order.status === "processing").length;
  const newCount = orders.filter((order) => order.status === "new").length;
  const tabTitle: Record<DashboardTab, string> = { overview: "الإحصائيات", products: "المنتجات", reviews: "آراء الزبونات", orders: "الطلبات", delivery: "أسعار التوصيل", settings: "الإعدادات" };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    router.push("/dashboard/login");
  };

  const deleteOrder = async (id: number) => {
    if (!confirm("هل أنت متأكدة من حذف هذا الطلب نهائياً؟")) return;
    try {
      const response = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("error");
      setOrders((current) => current.filter((order) => order.id !== id));
    } catch {
      alert("تعذر حذف الطلب");
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSettingsMessage("جارٍ الحفظ...");
    try {
      const response = await fetch("/api/settings/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password, confirmPassword }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "تعذر التحديث");
      setSettingsMessage("تم تحديث كلمة المرور بنجاح");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setSettingsMessage(error instanceof Error ? error.message : "تعذر تحديث كلمة المرور");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6ef] text-[#2a2522]" dir="rtl">
      <div className="lg:flex">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:flex sticky top-0 h-screen w-64 shrink-0 flex-col border-l border-[#e8e2dc] bg-white px-4 py-7">
          <a href="/" className="flex justify-center px-2">
            <img alt="Clochette" src="/logo.png" className="h-16 w-16 rounded-full object-cover" />
          </a>
          <div className="mt-9 px-2 pb-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#857d76]">لوحة التحكم</div>
          <nav className="flex flex-col gap-1.5">
            {TABS.map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                type="button"
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${tab === item.key ? "bg-[#a1688a] text-[#fffaf8]" : "text-[#857d76] hover:bg-[#E7D0D0]/60 hover:text-[#2a2522]"}`}
              >
                <Icon name={item.icon} size={17} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto border-t border-[#e8e2dc] pt-5 text-[11px] leading-6 text-[#857d76] px-2">
            Clochette Admin<br />إدارة متجركِ بكل بساطة
            <a href="/" className="mt-3 flex items-center gap-2 text-[12px] font-medium text-[#a1688a] hover:underline">
              <Icon name="store" size={15} /> عرض المتجر
            </a>
            <button onClick={logout} type="button" className="mt-2 flex items-center gap-2 text-[12px] font-medium text-red-500 hover:underline">
              تسجيل الخروج
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Topbar */}
          <header className="sticky top-0 z-30 border-b border-[#e8e2dc]" style={{ backgroundColor: "#E7D0D0" }}>
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <a href="/" className="lg:hidden">
                <img alt="Clochette" src="/logo.png" className="h-12 w-12 rounded-full object-cover" />
              </a>
              <div className="hidden lg:block">
                <h1 className="text-xl font-bold text-[#2a2522]">{tabTitle[tab]}</h1>
                <p className="mt-0.5 text-xs text-[#6b5f57]">{tab === "overview" ? "هذه نظرة سريعة على أداء متجرك اليوم" : "إدارة وتنظيم متجرك من مكان واحد"}</p>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#2a2522]">
                <span className="hidden sm:inline">مديرة المتجر</span>
                <div className="grid h-9 w-9 place-items-center rounded-full bg-white/70 font-bold text-[#a1688a]">ن</div>
                <button onClick={logout} type="button" className="rounded-full bg-white/60 px-3 py-1.5 text-[11px] font-medium text-red-600 lg:hidden">خروج</button>
              </div>
            </div>
            {/* Mobile tabs */}
            <nav className="flex gap-2 overflow-x-auto px-4 pb-3 sm:px-6 lg:hidden">
              {TABS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  type="button"
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium transition-colors ${tab === item.key ? "bg-[#a1688a] text-[#fffaf8]" : "bg-white/60 text-[#2a2522]"}`}
                >
                  <Icon name={item.icon} size={14} />
                  {item.label}
                </button>
              ))}
            </nav>
          </header>

          <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-9">
            <div className="mb-6 lg:hidden">
              <h1 className="text-xl font-bold text-[#2a2522]">{tabTitle[tab]}</h1>
              <p className="mt-1 text-xs text-[#857d76]">{tab === "overview" ? "هذه نظرة سريعة على أداء متجرك اليوم" : "إدارة وتنظيم متجرك من مكان واحد"}</p>
            </div>

            {tab === "overview" && <>
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "إجمالي الطلبات", value: String(orders.length), trend: "جميع الطلبات المسجلة", icon: "list" as IconName },
                  { label: "طلبات جديدة", value: String(newCount), trend: "بانتظار المعالجة", icon: "star" as IconName },
                  { label: "قيد المعالجة", value: String(processingCount), trend: "يحتاج إلى متابعة", icon: "chart" as IconName },
                  { label: "المبيعات", value: formatPrice(revenue, "ar"), trend: "إجمالي قيمة الطلبات", icon: "box" as IconName },
                ].map((stat) => (
                  <article key={stat.label} className={`${cardClass} p-5`}>
                    <div className="flex items-center justify-between text-xs text-[#857d76]">
                      <span>{stat.label}</span>
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#E7D0D0] text-[#a1688a]"><Icon name={stat.icon} size={16} /></span>
                    </div>
                    <div className="mt-4 text-2xl font-bold text-[#2a2522]">{stat.value}</div>
                    <div className="mt-1.5 text-[11px] text-[#a1688a]">{stat.trend}</div>
                  </article>
                ))}
              </section>

              <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
                <div className={`${cardClass} p-6`}>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-base font-bold text-[#a1688a]">نظرة على المبيعات</h2>
                    <span className="text-[11px] text-[#857d76]">آخر 7 أيام ⌄</span>
                  </div>
                  <div className="flex h-52 items-end justify-around gap-2 border-b border-[#e8e2dc] px-1 sm:gap-3">
                    {[42, 66, 52, 78, 61, 91, 73].map((height, index) => (
                      <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                        <div className="w-full max-w-[34px] rounded-t-md bg-[#a1688a]" style={{ height: `${height}%`, opacity: index === 5 ? 1 : 0.55 }} />
                        <span className="text-[10px] text-[#857d76]">{["سبت", "أحد", "اثن", "ثلا", "أرب", "خمي", "جمع"][index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`${cardClass} p-6`}>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-bold text-[#a1688a]">آخر الطلبات</h2>
                    <button className="text-[11px] font-medium text-[#a1688a] hover:underline" onClick={() => setTab("orders")} type="button">عرض الكل ←</button>
                  </div>
                  <div className="flex flex-col">
                    {orders.length === 0 ? (
                      <div className="py-4 text-center text-xs text-[#857d76]">لا توجد طلبات بعد</div>
                    ) : orders.slice(0, 4).map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b border-[#f1ece7] py-3 text-xs last:border-b-0">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#E7D0D0] text-[10px] font-bold text-[#2a2522]">{initials(order.customerName)}</span>
                          <span className="font-medium text-[#2a2522]">{order.customerName}</span>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>}

            {tab === "products" && <ProductsTab products={dbProducts} onUpdate={fetchDashboardData} />}

            {tab === "reviews" && <ReviewsTab reviews={dbReviews} onUpdate={fetchDashboardData} />}

            {tab === "orders" && (
              <section>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-[#a1688a]">قائمة الطلبيات</h2>
                  <span className="text-xs text-[#857d76]">{loading ? "جارٍ التحديث..." : `${orders.length} طلبات معروضة`}</span>
                </div>
                <div className={`${cardClass} overflow-hidden`}>
                  {orders.length === 0 ? (
                    <div className="px-6 py-14 text-center text-sm text-[#857d76]">لا توجد طلبات حالياً. ستظهر الطلبات الجديدة هنا فور وصولها من المتجر.</div>
                  ) : orders.map((order) => (
                    <div key={order.id} className="flex items-center gap-3 border-b border-[#f1ece7] px-4 py-3 transition-colors last:border-b-0 hover:bg-[#faf6f3]">
                      <a href={`/dashboard/orders/${order.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                        <span className="w-16 shrink-0 text-sm font-bold text-[#2a2522]">#{order.id}</span>
                        <span className="flex-1 truncate text-sm text-[#2a2522]">{order.customerName}</span>
                        <span className="shrink-0 text-[11px] font-medium text-[#a1688a]">التفاصيل ←</span>
                      </a>
                      <button onClick={() => deleteOrder(order.id)} type="button" className="shrink-0 rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-medium text-red-600 transition-colors hover:bg-red-100">حذف</button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {tab === "delivery" && <DeliveryTab />}

            {tab === "settings" && (
              <section>
                <h2 className="mb-5 text-lg font-bold text-[#a1688a]">الإعدادات</h2>
                <div className={`${cardClass} max-w-xl p-6`}>
                  <h3 className="text-base font-bold text-[#2a2522]">تغيير كلمة المرور</h3>
                  <p className="mt-1.5 text-xs text-[#857d76]">حدّثي كلمة مرور لوحة التحكم بشكل دوري للحفاظ على أمان حسابك.</p>
                  <form className="mt-6 flex flex-col gap-4" onSubmit={changePassword}>
                    <div>
                      <label className={labelClass} htmlFor="dash-password">كلمة المرور الجديدة</label>
                      <input id="dash-password" minLength={8} required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="8 أحرف على الأقل" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="dash-confirm">تأكيد كلمة المرور</label>
                      <input id="dash-confirm" minLength={8} required type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="أعيدي كتابة كلمة المرور" className={inputClass} />
                    </div>
                    <div className="flex items-center gap-3">
                      <button className={primaryButtonClass} type="submit">حفظ التغييرات</button>
                      {settingsMessage && <span className="text-xs font-medium text-[#a1688a]">{settingsMessage}</span>}
                    </div>
                  </form>
                </div>
                <BrandCard />
                <SocialSettingsCard />
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function BrandCard() {
  const [brand, setBrand] = useState({ logo: "", hero: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings/brand")
      .then(async (response) => {
        if (!response.ok) throw new Error("offline");
        const data = (await response.json()) as { brand: { logo: string; hero: string } };
        if (data.brand) setBrand(data.brand);
      })
      .catch(() => undefined);
  }, []);

  const uploadAsset = async (field: "logo" | "hero", file: File) => {
    setUploading(field);
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await response.json();
      if (!data.url) throw new Error(data.error || "error");
      setBrand((current) => ({ ...current, [field]: data.url }));
    } catch (error) {
      setMessage(error instanceof Error && error.message !== "error" ? error.message : "تعذر رفع الملف");
    } finally {
      setUploading("");
    }
  };

  const saveBrand = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/settings/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brand),
      });
      if (!response.ok) throw new Error("error");
      setMessage("تم حفظ اللوغو والهيرو بنجاح");
    } catch {
      setMessage("تعذر الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const heroIsVideo = /\.(mp4|webm)(\?|$)/i.test(brand.hero);

  return (
    <div className={`${cardClass} mt-5 max-w-xl p-6`}>
      <h3 className="text-base font-bold text-[#2a2522]">اللوغو والهيرو</h3>
      <p className="mt-1.5 text-xs text-[#857d76]">ارفعي لوغو المتجر (صورة) وهيرو الصفحة الرئيسية (صورة أو فيديو) ليظهرا في المتجر بدلاً من الملفات الثابتة.</p>
      <form className="mt-6 flex flex-col gap-5" onSubmit={saveBrand}>
        <div>
          <label className={labelClass}>لوغو المتجر</label>
          <div className="mt-1 flex items-center gap-4">
            {brand.logo ? <img src={brand.logo} alt="اللوغو الحالي" className="h-14 w-14 rounded-lg border border-[#e8e2dc] object-cover" /> : <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-[#d8cfc6] text-[10px] text-[#857d76]">فارغ</div>}
            <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#E7D0D0] px-4 py-2 text-xs font-medium text-[#2a2522] transition-opacity hover:opacity-80">
              <span>{uploading === "logo" ? "جارٍ الرفع..." : "رفع صورة اللوغو"}</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadAsset("logo", file);
                e.target.value = "";
              }} />
            </label>
            {brand.logo && <button type="button" onClick={() => setBrand((current) => ({ ...current, logo: "" }))} className="text-xs font-medium text-red-500 hover:text-red-700">إزالة</button>}
          </div>
        </div>
        <div>
          <label className={labelClass}>هيرو الصفحة الرئيسية</label>
          <div className="mt-1 flex items-center gap-4">
            {brand.hero ? (
              heroIsVideo ? (
                <video src={brand.hero} muted playsInline className="h-20 w-32 rounded-lg border border-[#e8e2dc] object-cover" />
              ) : (
                <img src={brand.hero} alt="الهيرو الحالي" className="h-20 w-32 rounded-lg border border-[#e8e2dc] object-cover" />
              )
            ) : (
              <div className="flex h-20 w-32 items-center justify-center rounded-lg border border-dashed border-[#d8cfc6] text-[10px] text-[#857d76]">فارغ</div>
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#E7D0D0] px-4 py-2 text-xs font-medium text-[#2a2522] transition-opacity hover:opacity-80">
              <span>{uploading === "hero" ? "جارٍ الرفع..." : "رفع صورة أو فيديو"}</span>
              <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadAsset("hero", file);
                e.target.value = "";
              }} />
            </label>
            {brand.hero && <button type="button" onClick={() => setBrand((current) => ({ ...current, hero: "" }))} className="text-xs font-medium text-red-500 hover:text-red-700">إزالة</button>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className={primaryButtonClass} disabled={saving} type="submit">{saving ? "جارٍ الحفظ..." : "حفظ اللوغو والهيرو"}</button>
          {message && <span className="text-xs font-medium text-[#a1688a]">{message}</span>}
        </div>
      </form>
    </div>
  );
}

function SocialSettingsCard() {
  const [links, setLinks] = useState({ instagram: "", facebook: "", tiktok: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings/social")
      .then(async (response) => {
        if (!response.ok) throw new Error("offline");
        const data = (await response.json()) as { links: { instagram: string; facebook: string; tiktok: string } };
        if (data.links) setLinks(data.links);
      })
      .catch(() => undefined);
  }, []);

  const saveLinks = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/settings/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(links),
      });
      if (!response.ok) throw new Error("error");
      setMessage("تم حفظ روابط التواصل الاجتماعي بنجاح");
    } catch {
      setMessage("تعذر حفظ الروابط");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${cardClass} mt-5 max-w-xl p-6`}>
      <h3 className="text-base font-bold text-[#2a2522]">مواقع التواصل الاجتماعي</h3>
      <p className="mt-1.5 text-xs text-[#857d76]">أضيفي روابط حساباتك لتظهر في الفوتر والقائمة الجانبية للمتجر.</p>
      <form className="mt-6 flex flex-col gap-4" onSubmit={saveLinks}>
        <div>
          <label className={labelClass} htmlFor="social-instagram">رابط Instagram</label>
          <input id="social-instagram" dir="ltr" type="url" value={links.instagram} onChange={(event) => setLinks((current) => ({ ...current, instagram: event.target.value }))} placeholder="https://www.instagram.com/..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="social-facebook">رابط Facebook</label>
          <input id="social-facebook" dir="ltr" type="url" value={links.facebook} onChange={(event) => setLinks((current) => ({ ...current, facebook: event.target.value }))} placeholder="https://www.facebook.com/..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="social-tiktok">رابط TikTok</label>
          <input id="social-tiktok" dir="ltr" type="url" value={links.tiktok} onChange={(event) => setLinks((current) => ({ ...current, tiktok: event.target.value }))} placeholder="https://www.tiktok.com/@..." className={inputClass} />
        </div>
        <div className="flex items-center gap-3">
          <button className={primaryButtonClass} disabled={saving} type="submit">{saving ? "جارٍ الحفظ..." : "حفظ الروابط"}</button>
          {message && <span className="text-xs font-medium text-[#a1688a]">{message}</span>}
        </div>
      </form>
    </div>
  );
}

function DeliveryTab() {
  const [prices, setPrices] = useState<Record<string, { home: string; office: string }>>({});
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings/delivery")
      .then(async (response) => {
        if (!response.ok) throw new Error("offline");
        const data = (await response.json()) as { prices: Record<string, { home: number; office: number }> };
        const initial: Record<string, { home: string; office: string }> = {};
        for (const [code, entry] of Object.entries(data.prices)) {
          initial[code] = { home: String(entry.home), office: String(entry.office) };
        }
        setPrices(initial);
      })
      .catch(() => undefined)
      .finally(() => setLoadingPrices(false));
  }, []);

  const updatePrice = (code: string, type: "home" | "office", value: string) => {
    setPrices((prev) => {
      const current = prev[code] ?? { home: "", office: "" };
      return { ...prev, [code]: { ...current, [type]: value } };
    });
  };

  const savePrices = async () => {
    setSaving(true);
    setMessage("");
    try {
      const payload: Record<string, { home: number; office: number }> = {};
      for (const [code, entry] of Object.entries(prices)) {
        const home = Number(entry.home);
        const office = Number(entry.office);
        if (entry.home.trim() === "" && entry.office.trim() === "") continue;
        payload[code] = {
          home: Number.isFinite(home) && home >= 0 ? home : 0,
          office: Number.isFinite(office) && office >= 0 ? office : 0,
        };
      }
      const response = await fetch("/api/settings/delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prices: payload }),
      });
      if (!response.ok) throw new Error("error");
      setMessage("تم حفظ أسعار التوصيل بنجاح");
    } catch {
      setMessage("تعذر حفظ أسعار التوصيل");
    } finally {
      setSaving(false);
    }
  };

  const filledCount = Object.values(prices).filter((entry) => entry.home.trim() !== "" || entry.office.trim() !== "").length;

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#a1688a]">أسعار التوصيل حسب الولاية</h2>
          <p className="mt-1 text-xs text-[#857d76]">حددي سعري التوصيل إلى المنزل وإلى المكتب لكل ولاية من الولايات الـ58 ({filledCount}/58 ولاية محددة)</p>
        </div>
        <div className="flex items-center gap-3">
          {message && <span className="text-xs font-medium text-[#a1688a]">{message}</span>}
          <button onClick={savePrices} disabled={saving || loadingPrices} className={primaryButtonClass}>{saving ? "جارٍ الحفظ..." : "حفظ الأسعار"}</button>
        </div>
      </div>
      {loadingPrices ? (
        <div className="rounded-xl border border-dashed border-[#d8cfc6] px-6 py-14 text-center text-sm text-[#857d76]">جارٍ تحميل أسعار التوصيل...</div>
      ) : (
        <div className={`${cardClass} p-5 sm:p-6`}>
          <div className="mb-3 hidden items-center gap-2 border-b border-[#f1ece7] pb-2 text-[11px] font-bold text-[#857d76] sm:flex">
            <span className="w-7" />
            <span className="w-24">الولاية</span>
            <span className="flex-1">التوصيل إلى المنزل (دج)</span>
            <span className="flex-1">التوصيل إلى المكتب (دج)</span>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">{
            WILAYAS.map((wilaya) => (
              <div key={wilaya.code} className="flex items-center gap-2">
                <span className="w-7 shrink-0 text-center text-xs font-bold text-[#857d76]">{wilaya.code}</span>
                <span className="w-24 shrink-0 truncate text-sm text-[#2a2522]">{wilaya.ar}</span>
                <input
                  type="number"
                  min="0"
                  value={prices[wilaya.code]?.home ?? ""}
                  onChange={(event) => updatePrice(wilaya.code, "home", event.target.value)}
                  placeholder="منزل"
                  aria-label={`سعر التوصيل إلى المنزل — ${wilaya.ar}`}
                  className="w-full min-w-0 rounded-lg border border-[#d8cfc6] bg-white px-2.5 py-1.5 text-sm text-[#2a2522] outline-none transition-colors focus:border-[#a1688a]"
                />
                <input
                  type="number"
                  min="0"
                  value={prices[wilaya.code]?.office ?? ""}
                  onChange={(event) => updatePrice(wilaya.code, "office", event.target.value)}
                  placeholder="مكتب"
                  aria-label={`سعر التوصيل إلى المكتب — ${wilaya.ar}`}
                  className="w-full min-w-0 rounded-lg border border-[#d8cfc6] bg-white px-2.5 py-1.5 text-sm text-[#2a2522] outline-none transition-colors focus:border-[#a1688a]"
                />
              </div>
            ))
          }</div>
        </div>
      )}
    </section>
  );
}

// حقل إضاف عناصر بالضغط على Enter — كل عنصر يُحفظ وحده بدون فواصل
function TagInput({ tags, onChange, placeholder, dir }: { tags: string[]; onChange: (next: string[]) => void; placeholder?: string; dir?: string }) {
  const [draft, setDraft] = useState("");
  const addTag = () => {
    const value = draft.trim();
    setDraft("");
    if (!value || tags.includes(value)) return;
    onChange([...tags, value]);
  };
  return (
    <div className={`${inputClass} flex flex-wrap items-center gap-2`}>
      {tags.map((tag, index) => (
        <span key={`${tag}-${index}`} className="flex items-center gap-1.5 rounded-full bg-[#E7D0D0] px-3 py-1 text-xs font-medium text-[#2a2522]">
          {tag}
          <button type="button" onClick={() => onChange(tags.filter((_, i) => i !== index))} className="leading-none text-red-500 hover:text-red-700" aria-label={`حذف ${tag}`}>×</button>
        </span>
      ))}
      <input
        dir={dir}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag();
          } else if (e.key === "Backspace" && !draft && tags.length > 0) {
            onChange(tags.slice(0, -1));
          }
        }}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="min-w-[90px] flex-1 bg-transparent text-sm outline-none"
      />
    </div>
  );
}

function ProductsTab({ products, onUpdate }: { products: DBProduct[]; onUpdate: () => void }) {
  const [editing, setEditing] = useState<ProductFormState | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const startEdit = (product: DBProduct) => {
    setEditing({
      id: product.id,
      nameAr: product.nameAr,
      nameFr: product.nameFr,
      price: product.price,
      discount: product.discount ?? "",
      descriptionAr: product.descriptionAr,
      descriptionFr: product.descriptionFr,
      images: product.images ?? [],
      imageColors: (product.images ?? []).map((img, index) => {
        const linked = (product.colors ?? []).find((entry) => typeof entry === "object" && entry.image === img);
        if (linked && typeof linked === "object") return linked.value;
        const legacy = (product.colors ?? [])[index];
        return typeof legacy === "string" ? legacy : "";
      }),
      sizes: product.sizes ?? [],
      category: product.category ?? "",
    });
  };

  const saveProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setIsSaving(true);
    const method = editing.id ? "PATCH" : "POST";
    const url = editing.id ? `/api/products/${editing.id}` : "/api/products";

    const payload = {
      nameAr: editing.nameAr,
      nameFr: editing.nameFr,
      price: editing.price,
      discount: editing.discount === "" ? null : Number(editing.discount),
      descriptionAr: editing.descriptionAr,
      descriptionFr: editing.descriptionFr,
      images: editing.images,
      colors: editing.images
        .map((img, i) => {
          const value = (editing.imageColors[i] ?? "").trim();
          return { ar: value, fr: value, value, image: img };
        })
        .filter((entry, index, list) => entry.value !== "" && list.findIndex((item) => item.value === entry.value) === index),
      sizes: editing.sizes,
      category: editing.category.trim() ? editing.category.trim() : null,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error");
      setEditing(null);
      onUpdate();
    } catch {
      alert("تعذر حفظ المنتج");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف المنتج نهائياً؟")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      onUpdate();
    } catch {
      alert("تعذر حذف المنتج");
    }
  };

  if (editing) {
    return (
      <section className={`${cardClass} p-5 sm:p-7`}>
        <h2 className="mb-6 text-lg font-bold text-[#a1688a]">{editing.id ? "تعديل المنتج" : "إضافة منتج جديد"}</h2>
        <form onSubmit={saveProduct} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>اسم المنتج (بالعربية)</label>
              <input required value={editing.nameAr} onChange={e => setEditing({ ...editing, nameAr: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>اسم المنتج (بالفرنسية)</label>
              <input required dir="ltr" value={editing.nameFr} onChange={e => setEditing({ ...editing, nameFr: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>السعر (دج)</label>
              <input required type="number" min="0" value={editing.price} onChange={e => setEditing({ ...editing, price: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>التخفيض % (اختياري)</label>
              <input type="number" min="0" max="99" value={editing.discount} onChange={e => setEditing({ ...editing, discount: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>القسم الذي يظهر فيه المنتج</label>
            <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className={inputClass}>
              <option value="">المنتجات الأكثر مبيعاً</option>
              <option value="التخفيضات">التخفيضات</option>
            </select>
            <p className="mt-1 text-[11px] text-[#857d76]">اختاري القسم الذي سيظهر فيه المنتج في المتجر. أضيفي نسبة تخفيض ليظهر السعر القديم مشطوباً.</p>
          </div>
          <div>
            <label className={labelClass}>الوصف (بالعربية)</label>
            <textarea required value={editing.descriptionAr} onChange={e => setEditing({ ...editing, descriptionAr: e.target.value })} className={`${inputClass} min-h-[100px]`} />
          </div>
          <div>
            <label className={labelClass}>الوصف (بالفرنسية)</label>
            <textarea required dir="ltr" value={editing.descriptionFr} onChange={e => setEditing({ ...editing, descriptionFr: e.target.value })} className={`${inputClass} min-h-[100px]`} />
          </div>
          <div>
            <label className={`${labelClass} mb-2`}>صور المنتج</label>
            <div className="mb-3 flex flex-wrap gap-4">
              {editing.images.map((img, i) => (
                <div key={i} className="group flex flex-col gap-1.5">
                  <div className="relative">
                    <img src={img} alt={`صورة ${i + 1}`} className="h-24 w-24 rounded-lg border border-[#e8e2dc] object-cover" />
                    <button type="button" onClick={() => {
                      const imgs = [...editing.images];
                      imgs.splice(i, 1);
                      const colorEntries = [...editing.imageColors];
                      colorEntries.splice(i, 1);
                      setEditing({ ...editing, images: imgs, imageColors: colorEntries });
                    }} className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">×</button>
                  </div>
                  <input
                    value={editing.imageColors[i] ?? ""}
                    onChange={(e) => {
                      const colorEntries = [...editing.imageColors];
                      colorEntries[i] = e.target.value;
                      setEditing({ ...editing, imageColors: colorEntries });
                    }}
                    placeholder="اللون"
                    className="w-24 rounded-md border border-[#d8cfc6] bg-white px-2 py-1 text-xs text-[#2a2522] outline-none transition-colors focus:border-[#a1688a]"
                  />
                </div>
              ))}
            </div>
            <p className="mb-2 text-[11px] text-[#857d76]">اكتبي لون كل صورة في الخانة التي تحتها — هكذا تظهر كل صورة مع لونها في صفحة المنتج.</p>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#a1688a] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
                <span>📷 رفع صورة من جهازك</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={async (e) => {
                  const files = e.target.files;
                  if (!files?.length) return;
                  const addedImages: string[] = [];
                  for (const file of Array.from(files)) {
                    const fd = new FormData();
                    fd.append("file", file);
                    try {
                      const res = await fetch("/api/upload", { method: "POST", body: fd });
                      const data = await res.json();
                      if (data.url) addedImages.push(data.url);
                      else alert(data.error || "تعذر رفع الصورة");
                    } catch { alert("تعذر رفع الصورة"); }
                  }
                  if (addedImages.length > 0) {
                    setEditing({
                      ...editing,
                      images: [...editing.images, ...addedImages],
                      imageColors: [...editing.imageColors, ...addedImages.map(() => "")],
                    });
                  }
                  e.target.value = "";
                }} />
              </label>
            </div>
          </div>
          <div>
            <label className={labelClass}>المقاسات</label>
            <TagInput dir="ltr" tags={editing.sizes} onChange={(sizes) => setEditing({ ...editing, sizes })} placeholder="اكتبي المقاس ثم اضغطي Enter" />
          </div>
          <div className="mt-2 flex gap-2">
            <button disabled={isSaving} type="submit" className={primaryButtonClass}>{isSaving ? "جارٍ الحفظ..." : "حفظ المنتج"}</button>
            <button type="button" onClick={() => setEditing(null)} className="rounded-full bg-[#f1ece7] px-5 py-2.5 text-sm font-medium text-[#2a2522] transition-opacity hover:opacity-80">إلغاء</button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[#a1688a]">كتالوج المنتجات</h2>
        <button onClick={() => setEditing(EMPTY_PRODUCT_FORM)} className={primaryButtonClass}>+ إضافة منتج جديد</button>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#d8cfc6] px-6 py-14 text-center text-sm text-[#857d76]">لا توجد منتجات حالياً. أضف منتجك الأول لتبدأ البيع.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {products.map(product => (
            <article key={product.id} className={`${cardClass} flex items-center gap-4 p-4`}>
              <img alt={product.nameAr} src={product.images?.[0] || "/placeholder.jpg"} className="h-24 w-20 shrink-0 rounded-lg object-cover sm:h-28 sm:w-24" />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-[#2a2522]">{product.nameAr}</h3>
                <div className="mt-0.5 truncate text-[11px] text-[#857d76]" dir="ltr">{product.nameFr}</div>
                {product.category ? <div className="mt-1 text-[11px] font-medium text-[#a1688a]">القسم: {product.category}</div> : null}
                <div className="mt-1.5 text-sm font-bold text-[#a1688a]">
                  {formatPrice(Number(product.price), "ar")}
                  {product.discount ? <span className="mr-2 text-[11px] font-medium text-[#bb8b3e]">-{product.discount}%</span> : null}
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <button onClick={() => startEdit(product)} className="rounded-full bg-[#E7D0D0] px-4 py-1.5 text-xs font-medium text-[#2a2522] transition-opacity hover:opacity-80">تعديل</button>
                <button onClick={() => deleteProduct(product.id)} className="rounded-full bg-red-50 px-4 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100">حذف</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ReviewsTab({ reviews, onUpdate }: { reviews: DBReview[]; onUpdate: () => void }) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadReviewImages = async (files: FileList) => {
    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        try {
          const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
          const uploadData = await uploadRes.json();
          if (!uploadData.url) {
            alert(uploadData.error || "تعذر رفع الصورة");
            continue;
          }
          const saveRes = await fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: uploadData.url }),
          });
          if (!saveRes.ok) alert("تعذر حفظ الصورة");
        } catch {
          alert("تعذر رفع الصورة");
        }
      }
      onUpdate();
    } finally {
      setIsUploading(false);
    }
  };

  const deleteReview = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return;
    try {
      await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      onUpdate();
    } catch {
      alert("تعذر حذف الصورة");
    }
  };

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[#a1688a]">صور آراء الزبونات</h2>
        <label className={`cursor-pointer rounded-full bg-[#a1688a] px-5 py-2.5 text-sm font-bold text-[#fffaf8] transition-opacity hover:opacity-90 ${isUploading ? "pointer-events-none opacity-60" : ""}`}>
          <span>{isUploading ? "جارٍ الرفع..." : "+ رفع صورة رأي"}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            disabled={isUploading}
            onChange={(e) => {
              if (e.target.files?.length) uploadReviewImages(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#d8cfc6] px-6 py-14 text-center text-sm text-[#857d76]">لا توجد صور آراء حالياً. ارفعي أول صورة (لقطة من رسائل الزبونات) لتظهر في المتجر.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {reviews.filter((review) => review.image && review.image.trim()).map((review) => (
            <div key={review.id} className="group relative">
              <img src={review.image} alt="رأي زبونة" className="h-44 w-full rounded-lg border border-[#e8e2dc] object-cover sm:h-48" />
              <button
                type="button"
                onClick={() => deleteReview(review.id)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
