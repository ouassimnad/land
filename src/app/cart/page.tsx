"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { WILAYAS, formatPrice } from "@/lib/catalog";
import { readCart, writeCart, type StoredCartLine } from "@/lib/cart";

type OrderForm = {
  customerName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
};

type DeliveryType = "home" | "office";
type WilayaDeliveryPrices = { home: number; office: number };

export default function CartPage() {
  const [lines, setLines] = useState<StoredCartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [deliveryPrices, setDeliveryPrices] = useState<Record<string, WilayaDeliveryPrices>>({});
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("home");
  const [logoUrl, setLogoUrl] = useState("");
  const [form, setForm] = useState<OrderForm>({
    customerName: "",
    phone: "",
    wilaya: "16",
    commune: WILAYAS.find((item) => item.code === "16")?.communes[0] ?? "الجزائر الوسطى",
    address: "",
  });

  useEffect(() => {
    setLines(readCart());
    setReady(true);
    fetch("/api/settings/brand")
      .then(async (response) => {
        if (!response.ok) throw new Error("offline");
        const data = (await response.json()) as { brand?: { logo?: string } };
        setLogoUrl(data.brand?.logo?.trim() ?? "");
      })
      .catch(() => undefined);
    fetch("/api/settings/delivery")
      .then(async (response) => {
        if (!response.ok) throw new Error("offline");
        const data = (await response.json()) as { prices: Record<string, WilayaDeliveryPrices> };
        if (data.prices) setDeliveryPrices(data.prices);
      })
      .catch(() => undefined);
  }, []);

  const selectedWilaya = WILAYAS.find((item) => item.code === form.wilaya) ?? WILAYAS[0];
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const wilayaPrices = deliveryPrices[form.wilaya];
  const deliveryFee = wilayaPrices ? wilayaPrices[deliveryType] : null;
  const total = subtotal + (deliveryFee ?? 0);

  const updateForm = (key: keyof OrderForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const removeLine = (key: string) => {
    setLines((current) => {
      const next = current.filter((line) => line.key !== key);
      writeCart(next);
      return next;
    });
  };

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("loading");
    try {
      // طلب واحد يحتوي جميع منتجات السلة
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          deliveryType,
          items: lines.map((line) => ({
            productId: line.productId ?? undefined,
            nameAr: line.nameAr,
            nameFr: line.nameFr,
            image: line.image,
            color: line.color,
            size: line.size,
            quantity: line.quantity,
            price: line.price,
          })),
        }),
      });
      if (!response.ok) throw new Error("order_failed");
      writeCart([]);
      setLines([]);
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6ef]" dir="rtl">
      <header className="sticky top-0 z-40 border-b border-[#e8e2dc] backdrop-blur-md" style={{ backgroundColor: "#E7D0D0" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
          <Link href="/" className="text-sm font-medium text-[#2a2522] hover:text-[#a1688a] transition-colors">العودة للمتجر</Link>
          <Link href="/" className="flex justify-center" aria-label="Clochette">
            {logoUrl && <img alt="Clochette logo" src={logoUrl} className="h-9 w-auto" />}
          </Link>
          <span aria-hidden="true" className="w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#a1688a]">سلة التسوق</h1>
          <span className="block h-[3px] w-24 rounded-full bg-[#a1688a] mx-auto mt-4" />
        </div>

        {submitState === "success" ? (
          <div className="mt-12 rounded-3xl border border-[#e8e2dc] bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">✓</div>
            <p className="text-lg font-bold text-[#a1688a] mt-4">تم استلام طلبكِ! سنتصل بكِ قريباً للتأكيد.</p>
            <Link href="/" className="inline-block mt-6 rounded-full bg-[#a1688a] text-[#fffaf8] px-8 py-3 text-sm font-bold transition-opacity hover:opacity-90">
              العودة للمتجر
            </Link>
          </div>
        ) : !ready ? null : lines.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-[#e8e2dc] bg-white p-10 text-center shadow-sm">
            <p className="text-[#857d76]">سلتك فارغة حالياً</p>
            <Link href="/" className="inline-block mt-6 rounded-full bg-[#a1688a] text-[#fffaf8] px-8 py-3 text-sm font-bold transition-opacity hover:opacity-90">
              تسوّقي الآن
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10 flex flex-col gap-3">
              {lines.map((line) => (
                <div key={line.key} className="flex items-center gap-4 rounded-2xl border border-[#e8e2dc] bg-white p-4">
                  <img src={line.image} alt="" className="w-16 h-20 object-cover rounded-xl bg-[#e3dedc]" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[#2a2522] truncate">{line.nameAr}</div>
                    <div className="text-xs text-[#857d76] mt-0.5">{line.color}{line.size ? ` · ${line.size}` : ""} × {line.quantity}</div>
                    <div className="text-sm font-bold text-[#a1688a] mt-1">{formatPrice(line.price * line.quantity, "ar")}</div>
                  </div>
                  <button type="button" aria-label="حذف" onClick={() => removeLine(line.key)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                    حذف
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl bg-[#faf6f3] border border-[#e8e2dc] p-5">
              <div className="flex justify-between text-sm text-[#2a2522]">
                <span>مجموع المنتجات</span>
                <span>{formatPrice(subtotal, "ar")}</span>
              </div>
              <div className="flex justify-between text-sm text-[#2a2522] mt-2">
                <span>التوصيل ({deliveryType === "home" ? "إلى المنزل" : "إلى المكتب"} — {selectedWilaya.ar})</span>
                <span>{deliveryFee === null ? "—" : formatPrice(deliveryFee, "ar")}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#a1688a] mt-3 border-t border-[#e8e2dc] pt-3">
                <span>المجموع الكلي</span>
                <span>{formatPrice(total, "ar")}</span>
              </div>
              <p className="text-xs text-[#857d76] mt-2">يُؤكد الطلب هاتفياً قبل الشحن — الدفع عند الاستلام.</p>
            </div>

            <div className="mt-10 rounded-3xl border border-[#e8e2dc] bg-white p-6 md:p-10 shadow-sm">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#a1688a]">معلومات التوصيل</h2>
                <span className="block h-[3px] w-16 rounded-full bg-[#a1688a] mx-auto mt-3" />
                <p className="text-sm text-[#857d76] mt-4">املئي معلوماتك وسنتواصل معكِ هاتفياً لتأكيد الطلب قبل الشحن — بدون دفع مسبق.</p>
              </div>

              <form className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={submitOrder}>
                <div>
                  <label className="block text-sm font-medium text-[#2a2522] mb-1" htmlFor="customerName">الاسم الكامل</label>
                  <input id="customerName" required value={form.customerName} onChange={(event) => updateForm("customerName", event.target.value)} placeholder="الاسم الكامل" className="w-full rounded-xl border border-[#d8cfc6] px-4 py-3 text-sm outline-none focus:border-[#a1688a]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2a2522] mb-1" htmlFor="phone">رقم الهاتف</label>
                  <input id="phone" required type="tel" dir="ltr" value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} placeholder="05 / 06 / 07 xx xx xx xx" className="w-full rounded-xl border border-[#d8cfc6] px-4 py-3 text-sm outline-none focus:border-[#a1688a]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2a2522] mb-1" htmlFor="wilaya">الولاية</label>
                  <select id="wilaya" required value={form.wilaya} onChange={(event) => { const next = WILAYAS.find((item) => item.code === event.target.value) ?? WILAYAS[0]; setForm((current) => ({ ...current, wilaya: next.code, commune: next.communes[0] })); }} className="w-full rounded-xl border border-[#d8cfc6] bg-white px-4 py-3 text-sm outline-none focus:border-[#a1688a]">
                    <option value="">اختاري الولاية</option>
                    {WILAYAS.map((item) => <option key={item.code} value={item.code}>{item.code} — {item.ar}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2a2522] mb-1" htmlFor="commune">البلدية</label>
                  <select id="commune" required value={form.commune} onChange={(event) => updateForm("commune", event.target.value)} className="w-full rounded-xl border border-[#d8cfc6] bg-white px-4 py-3 text-sm outline-none focus:border-[#a1688a]">
                    {selectedWilaya.communes.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-sm font-medium text-[#2a2522] mb-1">طريقة التوصيل</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {([
                      { value: "home" as DeliveryType, label: "التوصيل إلى المنزل", price: wilayaPrices?.home ?? null },
                      { value: "office" as DeliveryType, label: "التوصيل إلى المكتب", price: wilayaPrices?.office ?? null },
                    ]).map((option) => (
                      <label
                        key={option.value}
                        className={`cursor-pointer rounded-xl border p-4 transition-colors ${deliveryType === option.value ? "border-[#a1688a] bg-[#f7ecf2]" : "border-[#d8cfc6] bg-white hover:border-[#a1688a]/50"}`}
                      >
                        <input type="radio" name="deliveryType" value={option.value} checked={deliveryType === option.value} onChange={() => setDeliveryType(option.value)} className="sr-only" />
                        <span className="block text-sm font-bold text-[#2a2522]">{option.label}</span>
                        <span className="block text-sm font-medium text-[#a1688a] mt-1">{option.price === null ? "يُحدد حسب الوجهة" : formatPrice(option.price, "ar")}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[#2a2522] mb-1" htmlFor="address">العنوان التفصيلي</label>
                  <textarea id="address" required value={form.address} onChange={(event) => updateForm("address", event.target.value)} placeholder="الحي، رقم المنزل، معلم قريب..." className="w-full rounded-xl border border-[#d8cfc6] px-4 py-3 text-sm outline-none focus:border-[#a1688a] min-h-[88px]" />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" disabled={submitState === "loading"} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#a1688a] text-[#fffaf8] px-8 py-4 text-base font-bold transition-opacity hover:opacity-90 disabled:opacity-60">
                    {submitState === "loading" ? "جارٍ الإرسال..." : "تأكيد الطلب"}
                  </button>
                  {submitState === "error" && <p className="text-center text-sm font-medium text-red-600 mt-4">تعذر إرسال الطلب حالياً، يرجى المحاولة من جديد.</p>}
                </div>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
