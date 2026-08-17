"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/catalog";
import type { OrderItem } from "@/db/schema";

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
  deliveryType?: string | null;
  items?: OrderItem[] | null;
  createdAt: string;
};

function statusLabel(status: string) {
  if (status === "processing") return "قيد المعالجة";
  if (status === "delivered") return "تم التوصيل";
  return "جديد";
}

function statusStyle(status: string) {
  if (status === "processing") return "bg-[#eef1e8] text-[#617549]";
  if (status === "delivered") return "bg-[#f1eeec] text-[#857d76]";
  return "bg-[#fdf2dd] text-[#bb8b3e]";
}

const editInputClass = "mt-1 w-full rounded-lg border border-[#d8cfc6] bg-[#faf6f3] p-2 text-sm outline-none focus:border-[#617549]";

export default function OrderDetailClient({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Order>>({});

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("not_found");
        const data = await response.json() as { order: Order };
        setOrder(data.order);
        setEditForm(data.order);
      })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  const updateField = (key: keyof Order, value: string) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!response.ok) throw new Error("Failed to update");
      const data = await response.json() as { order: Order };
      setOrder(data.order);
      setIsEditing(false);
    } catch (e) {
      alert("حدث خطأ أثناء حفظ التعديلات");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteOrder = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب نهائياً؟")) return;
    try {
      const response = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      window.location.href = "/dashboard";
    } catch {
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf8] text-[#2a2522]" dir="rtl">
      <header className="sticky top-0 z-30 border-b border-[#e8e2dc]" style={{ backgroundColor: "#E7D0D0" }}>
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="/dashboard">
            <img alt="Clochette" src="/logo.png" className="h-12 w-12 rounded-full object-cover" />
          </a>
          <div>
            <h1 className="text-lg font-bold text-[#2a2522]">تفاصيل الطلب</h1>
            <p className="hidden text-xs text-[#6b5f57] sm:block">مراجعة معلومات الطلب وتعديلها أو حذفها</p>
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-sm font-bold text-[#617549]">ن</div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-9">
        <a className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-[#617549] hover:underline" href="/dashboard">→ العودة إلى الطلبات</a>
        {loading && <div className="rounded-xl border border-dashed border-[#d8cfc6] px-6 py-14 text-center text-sm text-[#857d76]">جارٍ تحميل تفاصيل الطلب...</div>}
        {!loading && !order && <div className="rounded-xl border border-dashed border-[#d8cfc6] px-6 py-14 text-center text-sm text-[#857d76]">الطلب غير موجود</div>}
        {!loading && order && (
          <article className="rounded-xl border border-[#e8e2dc] bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#f1ece7] pb-5">
              <div>
                <h2 className="text-xl font-bold text-[#2a2522]">طلب #{order.id}</h2>
                <p className="mt-1.5 text-[11px] text-[#857d76]">{new Intl.DateTimeFormat("ar-DZ", { dateStyle: "full", timeStyle: "short" }).format(new Date(order.createdAt))}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {isEditing ? (
                  <select value={editForm.status} onChange={(e) => updateField("status", e.target.value)} className="rounded-lg border border-[#d8cfc6] bg-[#faf6f3] p-2 text-sm outline-none focus:border-[#617549]">
                    <option value="new">جديد</option>
                    <option value="processing">قيد المعالجة</option>
                    <option value="delivered">تم التوصيل</option>
                  </select>
                ) : (
                  <span className={`rounded-full px-3 py-1.5 text-[11px] font-medium ${statusStyle(order.status)}`}>{statusLabel(order.status)}</span>
                )}

                {!isEditing ? (
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditing(true)} className="rounded-full bg-[#E7D0D0] px-4 py-2 text-xs font-bold text-[#2a2522] transition-opacity hover:opacity-80">تعديل الطلب</button>
                    <button onClick={deleteOrder} className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-100">حذف</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button disabled={isSaving} onClick={saveChanges} className="rounded-full bg-[#617549] px-4 py-2 text-xs font-bold text-[#fffaf8] transition-opacity hover:opacity-90 disabled:opacity-60">{isSaving ? "جارٍ الحفظ..." : "حفظ التغييرات"}</button>
                    <button onClick={() => { setIsEditing(false); setEditForm(order); }} className="rounded-full bg-[#f1ece7] px-4 py-2 text-xs font-medium text-[#2a2522] transition-opacity hover:opacity-80">إلغاء</button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 pt-6 sm:grid-cols-2">
              <div>
                <small className="mb-1 block text-[10px] text-[#857d76]">الزبونة</small>
                {isEditing ? <input value={editForm.customerName || ""} onChange={(e) => updateField("customerName", e.target.value)} className={editInputClass} /> : <strong className="text-[13px] font-medium text-[#2a2522]">{order.customerName}</strong>}
              </div>
              <div>
                <small className="mb-1 block text-[10px] text-[#857d76]">رقم الهاتف</small>
                {isEditing ? <input value={editForm.phone || ""} onChange={(e) => updateField("phone", e.target.value)} className={editInputClass} /> : <strong className="text-[13px] font-medium text-[#2a2522]">{order.phone}</strong>}
              </div>
              <div>
                <small className="mb-1 block text-[10px] text-[#857d76]">الولاية</small>
                {isEditing ? <input value={editForm.wilaya || ""} onChange={(e) => updateField("wilaya", e.target.value)} className={editInputClass} /> : <strong className="text-[13px] font-medium text-[#2a2522]">{order.wilaya}</strong>}
              </div>
              <div>
                <small className="mb-1 block text-[10px] text-[#857d76]">البلدية</small>
                {isEditing ? <input value={editForm.commune || ""} onChange={(e) => updateField("commune", e.target.value)} className={editInputClass} /> : <strong className="text-[13px] font-medium text-[#2a2522]">{order.commune}</strong>}
              </div>
              <div className="sm:col-span-2">
                <small className="mb-1 block text-[10px] text-[#857d76]">العنوان التفصيلي</small>
                {isEditing ? <input value={editForm.address || ""} onChange={(e) => updateField("address", e.target.value)} className={editInputClass} /> : <strong className="text-[13px] font-medium text-[#2a2522]">{order.address}</strong>}
              </div>
              <div>
                <small className="mb-1 block text-[10px] text-[#857d76]">سعر التوصيل</small>
                <strong className="text-[13px] font-medium text-[#2a2522]">{formatPrice(Number(order.deliveryPrice), "ar")}</strong>
              </div>
              <div>
                <small className="mb-1 block text-[10px] text-[#857d76]">طريقة التوصيل</small>
                <strong className="text-[13px] font-medium text-[#2a2522]">{order.deliveryType === "office" ? "إلى المكتب" : "إلى المنزل"}</strong>
              </div>
            </div>

            {order.items && order.items.length > 0 ? (
              <div className="mt-6">
                <small className="mb-2 block text-[10px] text-[#857d76]">المنتجات ({order.items.length})</small>
                <div className="flex flex-col gap-2">
                  {order.items.map((item, index) => (
                    <div key={`${item.productId ?? "item"}-${index}`} className="flex items-center gap-3 rounded-lg border border-[#f1ece7] bg-[#faf6f3] p-3">
                      {item.image ? <img alt={item.nameAr} src={item.image} className="h-14 w-11 shrink-0 rounded-lg object-cover" /> : null}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-medium text-[#2a2522]">{item.nameAr || "منتج"}</div>
                        <div className="mt-0.5 text-[11px] text-[#857d76]">{[item.color, item.size].filter(Boolean).join(" · ") || "بدون مواصفات"} × {item.quantity}</div>
                      </div>
                      <strong className="shrink-0 text-[13px] font-bold text-[#617549]">{formatPrice(item.unitPrice * item.quantity, "ar")}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <small className="mb-2 block text-[10px] text-[#857d76]">المنتج</small>
                <div className="flex items-center gap-3 rounded-lg border border-[#f1ece7] bg-[#faf6f3] p-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-[#2a2522]">× {order.quantity}</div>
                    <div className="mt-0.5 text-[11px] text-[#857d76]">{order.color || "بدون لون"} · {order.size || "بدون مقاس"}</div>
                  </div>
                  <strong className="shrink-0 text-[13px] font-bold text-[#617549]">{formatPrice(Number(order.unitPrice) * order.quantity, "ar")}</strong>
                </div>
              </div>
            )}

            <div className="mt-7 rounded-lg bg-[#E7D0D0] px-5 py-4 text-[#2a2522]">
              <span className="block text-[10px] text-[#6b5f57]">المجموع شامل التوصيل</span>
              <strong className="mt-1 block text-xl font-bold">{formatPrice(Number(order.totalPrice), "ar")}</strong>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
