"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { PRODUCT, formatPrice } from "@/lib/catalog";

type DashboardTab = "overview" | "products" | "orders" | "settings";
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
  status: string;
  createdAt: string;
};

type DBProduct = {
  id: number;
  name: string;
  price: string | number;
  oldPrice: string | number | null;
  description: string;
  image: string;
  colors: string[];
  sizes: string[];
  active: boolean;
};

const DEMO_ORDERS: Order[] = [
  { id: 1024, customerName: "سارة بن عيسى", phone: "0550 12 34 56", wilaya: "16", commune: "الجزائر الوسطى", address: "حي الأبيار، الجزائر", quantity: 1, color: "وردي بودري", size: "M", unitPrice: 4900, deliveryPrice: 600, totalPrice: 5500, status: "new", createdAt: "2025-05-19T11:45:00.000Z" },
  { id: 1023, customerName: "ريم قادري", phone: "0661 45 67 89", wilaya: "31", commune: "بئر الجير", address: "المدينة الجديدة، وهران", quantity: 2, color: "أخضر مريمي", size: "L", unitPrice: 4900, deliveryPrice: 600, totalPrice: 10400, status: "processing", createdAt: "2025-05-18T09:12:00.000Z" },
  { id: 1022, customerName: "ليلى مراد", phone: "0772 98 76 54", wilaya: "25", commune: "الخروب", address: "وسط المدينة، قسنطينة", quantity: 1, color: "عاجي", size: "S", unitPrice: 4900, deliveryPrice: 600, totalPrice: 5500, status: "delivered", createdAt: "2025-05-17T14:28:00.000Z" },
  { id: 1021, customerName: "نور الهدى", phone: "0555 33 21 10", wilaya: "09", commune: "البليدة", address: "حي الورود، البليدة", quantity: 1, color: "وردي بودري", size: "XL", unitPrice: 4900, deliveryPrice: 600, totalPrice: 5500, status: "processing", createdAt: "2025-05-16T16:05:00.000Z" },
];

function DashIcon({ symbol }: { symbol: string }) {
  return <span aria-hidden="true" className="inline-grid h-5 w-5 place-items-center text-[15px]">{symbol}</span>;
}

function statusLabel(status: string) {
  if (status === "processing") return "قيد المعالجة";
  if (status === "delivered") return "تم التوصيل";
  return "جديد";
}

function dateLabel(date: string) {
  return new Intl.DateTimeFormat("ar-DZ", { day: "numeric", month: "short" }).format(new Date(date));
}

function initials(name: string) {
  return name.trim().split(" ").slice(0, 2).map((item) => item[0]).join("");
}

export default function DashboardPage() {
  const [tab, setTab] = useState<DashboardTab>("overview");
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settingsMessage, setSettingsMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [dbProducts, setDbProducts] = useState<DBProduct[]>([]);

  const fetchDashboardData = () => {
    fetch("/api/orders")
      .then(async (response) => {
        if (!response.ok) throw new Error("offline");
        return response.json() as Promise<{ orders: Order[] }>;
      })
      .then((data) => { if (data.orders && data.orders.length) setOrders(data.orders); })
      .catch(() => undefined)
      .finally(() => setLoading(false));

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => { if (data.products) setDbProducts(data.products); })
      .catch(() => undefined);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const revenue = useMemo(() => orders.reduce((sum, order) => sum + Number(order.totalPrice), 0), [orders]);
  const processingCount = orders.filter((order) => order.status === "processing").length;
  const newCount = orders.filter((order) => order.status === "new").length;
  const tabTitle: Record<DashboardTab, string> = { overview: "صباح الخير، نايـا", products: "المنتجات", orders: "الطلبات", settings: "الإعدادات" };

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
    <div className="dashboard-page" dir="rtl">
      <div className="dashboard-layout" dir="ltr">
        <aside className="dashboard-sidebar">
          <a className="dashboard-brand" href="/"><img alt="Clochette" src="/logo.png" /><span>Clochette</span></a>
          <div className="dashboard-nav-label">Workspace</div>
          <nav className="dashboard-nav">
            <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")} type="button"><DashIcon symbol="⌂" /><span>الإحصائيات</span></button>
            <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")} type="button"><DashIcon symbol="▦" /><span>المنتجات</span></button>
            <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")} type="button"><DashIcon symbol="□" /><span>الطلبات</span></button>
            <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")} type="button"><DashIcon symbol="⚙" /><span>الإعدادات</span></button>
          </nav>
          <div className="dashboard-sidebar-foot">Clochette Admin<br />إدارة متجركِ بكل بساطة</div>
        </aside>

        <main className="dashboard-main" dir="rtl">
          <div className="dashboard-topbar">
            <div><h1>{tabTitle[tab]}</h1><p>{tab === "overview" ? "هذه نظرة سريعة على أداء متجرك اليوم" : "إدارة وتنظيم متجرك من مكان واحد"}</p></div>
            <div className="admin-avatar"><span>مديرة المتجر</span><div>ن</div></div>
          </div>

          {tab === "overview" && <>
            <section className="dashboard-stats">
              <article className="stat-card"><div className="stat-card-top"><span>إجمالي الطلبات</span><span className="stat-icon"><DashIcon symbol="□" /></span></div><div className="stat-value">{orders.length + 248}</div><div className="stat-trend">↗ 12.5% مقارنة بالشهر الماضي</div></article>
              <article className="stat-card"><div className="stat-card-top"><span>قيد المعالجة</span><span className="stat-icon"><DashIcon symbol="◷" /></span></div><div className="stat-value">{newCount + processingCount}</div><div className="stat-trend">يحتاج إلى متابعة اليوم</div></article>
              <article className="stat-card"><div className="stat-card-top"><span>المبيعات</span><span className="stat-icon"><DashIcon symbol="◇" /></span></div><div className="stat-value">{formatPrice(revenue + 128450, "ar")}</div><div className="stat-trend">↗ 8.2% هذا الشهر</div></article>
              <article className="stat-card"><div className="stat-card-top"><span>معدل التحويل</span><span className="stat-icon"><DashIcon symbol="%" /></span></div><div className="stat-value">7.8%</div><div className="stat-trend">↗ 1.4% عن الأسبوع الماضي</div></article>
            </section>
            <section className="dashboard-content-grid">
              <div className="dashboard-panel"><div className="panel-header"><h2 className="panel-title">نظرة على المبيعات</h2><button className="panel-link" type="button">آخر 7 أيام⌄</button></div><div className="chart">{[42, 66, 52, 78, 61, 91, 73].map((height, index) => <div className="chart-bar-wrap" key={index}><div className="chart-bar" style={{ height: `${height}%` }} /><span className="chart-label">{["سبت", "أحد", "اثن", "ثلا", "أرب", "خمي", "جمع"][index]}</span></div>)}</div></div>
              <div className="dashboard-panel"><div className="panel-header"><h2 className="panel-title">آخر الطلبات</h2><button className="panel-link" onClick={() => setTab("orders")} type="button">عرض الكل ←</button></div><div className="order-list">{orders.slice(0, 4).map((order) => <div className="order-row-mini" key={order.id}><div className="order-customer"><span className="mini-avatar">{initials(order.customerName)}</span><span>{order.customerName}</span></div><span className={`status ${order.status}`}>{statusLabel(order.status)}</span></div>)}</div></div>
            </section>
          </>}

          {tab === "products" && <ProductsTab products={dbProducts} onUpdate={fetchDashboardData} />}

          {tab === "orders" && <section><div className="dashboard-section-header"><h2>قائمة الطلبيات</h2><span className="text-xs text-[#9aa29b]">{loading ? "جارٍ التحديث..." : `${orders.length} طلبات معروضة`}</span></div><div className="orders-table"><table><thead><tr><th>رقم الطلب</th><th>الزبونة</th><th>الولاية</th><th>المجموع</th><th>التاريخ</th><th>الحالة</th><th /></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td>#{order.id}</td><td className="table-customer">{order.customerName}<div className="text-[10px] font-normal text-[#a0aaa1]">{order.phone}</div></td><td>{order.wilaya} · {order.commune}</td><td>{formatPrice(Number(order.totalPrice), "ar")}</td><td>{dateLabel(order.createdAt)}</td><td><span className={`status ${order.status}`}>{statusLabel(order.status)}</span></td><td><a className="table-action" href={`/dashboard/orders/${order.id}`}>التفاصيل ←</a></td></tr>)}</tbody></table></div></section>}

          {tab === "settings" && <section><div className="dashboard-section-header"><h2>إعدادات الحساب</h2></div><div className="settings-card"><h3>تغيير كلمة المرور</h3><p>حدّثي كلمة مرور لوحة التحكم بشكل دوري للحفاظ على أمان حسابك.</p><form className="settings-form" onSubmit={changePassword}><label>كلمة المرور الجديدة<input minLength={8} required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="8 أحرف على الأقل" /></label><label>تأكيد كلمة المرور<input minLength={8} required type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="أعيدي كتابة كلمة المرور" /></label><button className="settings-submit" type="submit">حفظ التغييرات</button>{settingsMessage && <span className="settings-message">{settingsMessage}</span>}</form></div></section>}
        </main>
      </div>
    </div>
  );
}

function ProductsTab({ products, onUpdate }: { products: DBProduct[]; onUpdate: () => void }) {
  const [editing, setEditing] = useState<Partial<DBProduct> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const saveProduct = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const method = editing?.id ? "PATCH" : "POST";
    const url = editing?.id ? `/api/products/${editing.id}` : "/api/products";
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
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
      <section className="bg-white p-6 rounded-xl border border-gray-100">
        <h2 className="text-xl font-bold mb-4">{editing.id ? "تعديل المنتج" : "إضافة منتج جديد"}</h2>
        <form onSubmit={saveProduct} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">اسم المنتج</label>
            <input required value={editing.name || ""} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full p-2 border rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">السعر (دج)</label>
              <input required type="number" value={editing.price || ""} onChange={e => setEditing({...editing, price: e.target.value})} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">السعر القديم (اختياري)</label>
              <input type="number" value={editing.oldPrice || ""} onChange={e => setEditing({...editing, oldPrice: e.target.value})} className="w-full p-2 border rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">الوصف</label>
            <textarea required value={editing.description || ""} onChange={e => setEditing({...editing, description: e.target.value})} className="w-full p-2 border rounded-md min-h-[100px]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">رابط الصورة الرئيسية</label>
            <input required value={editing.image || ""} onChange={e => setEditing({...editing, image: e.target.value})} className="w-full p-2 border rounded-md" dir="ltr" />
          </div>
          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" checked={editing.active ?? true} onChange={e => setEditing({...editing, active: e.target.checked})} />
            <span>منتج نشط ومتاح للطلب</span>
          </label>
          <div className="flex gap-2 mt-4">
            <button disabled={isSaving} type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">{isSaving ? "جارٍ الحفظ..." : "حفظ المنتج"}</button>
            <button type="button" onClick={() => setEditing(null)} className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200">إلغاء</button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section>
      <div className="dashboard-section-header">
        <h2>كتالوج المنتجات</h2>
        <button onClick={() => setEditing({ active: true })} className="bg-[#425044] text-white px-4 py-2 rounded-md text-sm hover:bg-[#344036]">+ إضافة منتج جديد</button>
      </div>
      
      {products.length === 0 ? (
        <div className="empty-state">لا توجد منتجات حالياً. أضف منتجك الأول لتبدأ البيع.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map(product => (
            <article key={product.id} className="product-admin-card relative">
              <img alt={product.name} src={product.image} className="w-24 h-24 object-cover rounded-md" />
              <div className="product-admin-details flex-1">
                <h3>{product.name}</h3>
                <div className="admin-price mt-2">
                  {formatPrice(Number(product.price), "ar")} 
                  {product.oldPrice && <span className="ml-2 text-[11px] text-[#a5aea6] line-through">{formatPrice(Number(product.oldPrice), "ar")}</span>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={product.active ? "active-chip" : "bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-medium"}>
                  {product.active ? "نشط" : "غير نشط"}
                </span>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setEditing(product)} className="text-sm bg-gray-50 px-3 py-1 rounded border hover:bg-gray-100">تعديل</button>
                  <button onClick={() => deleteProduct(product.id)} className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded border border-red-100 hover:bg-red-100">حذف</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

