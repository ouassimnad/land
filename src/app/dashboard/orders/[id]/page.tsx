"use client";

import { use, useEffect, useState } from "react";
import { PRODUCT, formatPrice } from "@/lib/catalog";

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

function statusLabel(status: string) {
  if (status === "processing") return "قيد المعالجة";
  if (status === "delivered") return "تم التوصيل";
  return "جديد";
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
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
      .catch(() => setOrder({ id: Number(id), customerName: "سارة بن عيسى", phone: "0550 12 34 56", wilaya: "16", commune: "الجزائر الوسطى", address: "حي الأبيار، الجزائر العاصمة", quantity: 1, color: "وردي بودري", size: "M", unitPrice: 4900, deliveryPrice: 600, totalPrice: 5500, status: "new", createdAt: "2025-05-19T11:45:00.000Z" }))
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
    <div className="dashboard-page" dir="rtl">
      <div className="dashboard-layout" dir="ltr">
        <aside className="dashboard-sidebar"><a className="dashboard-brand" href="/"><img alt="Clochette" src="/logo.png" /><span>Clochette</span></a><div className="dashboard-nav-label">Workspace</div><nav className="dashboard-nav"><a className="flex items-center gap-3 rounded-lg px-3 py-3 text-[13px] text-[#7e887f] no-underline hover:bg-[#edf4ed]" href="/dashboard">⌂ <span>العودة للوحة</span></a></nav><div className="dashboard-sidebar-foot">Clochette Admin<br />إدارة متجركِ بكل بساطة</div></aside>
        <main className="dashboard-main" dir="rtl">
          <div className="dashboard-topbar"><div><h1>تفاصيل الطلب</h1><p>مراجعة معلومات الطلب وتعديلها أو التخلص منها</p></div><div className="admin-avatar"><span>مديرة المتجر</span><div>ن</div></div></div>
          <a className="back-link" href="/dashboard">→ العودة إلى الطلبات</a>
          {loading && <div className="empty-state">جارٍ تحميل تفاصيل الطلب...</div>}
          {!loading && order && (
            <article className="detail-card">
              <div className="detail-header">
                <div>
                  <h2>طلب #{order.id}</h2>
                  <p>{new Intl.DateTimeFormat("ar-DZ", { dateStyle: "full", timeStyle: "short" }).format(new Date(order.createdAt))}</p>
                </div>
                <div className="flex items-center gap-4">
                  {isEditing ? (
                    <select value={editForm.status} onChange={(e) => updateField("status", e.target.value)} className="rounded-md border p-2 text-sm bg-gray-50 outline-none">
                      <option value="new">جديد</option>
                      <option value="processing">قيد المعالجة</option>
                      <option value="delivered">تم التوصيل</option>
                    </select>
                  ) : (
                    <span className={`status ${order.status}`}>{statusLabel(order.status)}</span>
                  )}
                  
                  {!isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditing(true)} className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200">تعديل الطلب</button>
                      <button onClick={deleteOrder} className="rounded-md bg-red-50 text-red-600 px-4 py-2 text-sm font-medium hover:bg-red-100">حذف</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button disabled={isSaving} onClick={saveChanges} className="rounded-md bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700">{isSaving ? "جارٍ الحفظ..." : "حفظ التغييرات"}</button>
                      <button onClick={() => { setIsEditing(false); setEditForm(order); }} className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200">إلغاء</button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="detail-grid">
                <div className="detail-item">
                  <small>الزبونة</small>
                  {isEditing ? <input value={editForm.customerName || ""} onChange={(e) => updateField("customerName", e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm outline-none bg-gray-50" /> : <strong>{order.customerName}</strong>}
                </div>
                <div className="detail-item">
                  <small>رقم الهاتف</small>
                  {isEditing ? <input value={editForm.phone || ""} onChange={(e) => updateField("phone", e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm outline-none bg-gray-50" /> : <strong>{order.phone}</strong>}
                </div>
                <div className="detail-item">
                  <small>الولاية</small>
                  {isEditing ? <input value={editForm.wilaya || ""} onChange={(e) => updateField("wilaya", e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm outline-none bg-gray-50" /> : <strong>{order.wilaya}</strong>}
                </div>
                <div className="detail-item">
                  <small>البلدية</small>
                  {isEditing ? <input value={editForm.commune || ""} onChange={(e) => updateField("commune", e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm outline-none bg-gray-50" /> : <strong>{order.commune}</strong>}
                </div>
                <div className="detail-item col-span-2">
                  <small>العنوان التفصيلي</small>
                  {isEditing ? <input value={editForm.address || ""} onChange={(e) => updateField("address", e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm outline-none bg-gray-50" /> : <strong>{order.address}</strong>}
                </div>
                <div className="detail-item">
                  <small>المنتج</small>
                  <strong>{PRODUCT.name.ar} × {order.quantity}</strong>
                </div>
                <div className="detail-item">
                  <small>اللون / المقاس</small>
                  <strong>{order.color} · {order.size}</strong>
                </div>
              </div>
              
              <div className="detail-total">
                <span>المجموع شامل التوصيل</span>
                <strong>{formatPrice(Number(order.totalPrice), "ar")}</strong>
              </div>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}
