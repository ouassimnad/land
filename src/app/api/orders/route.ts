import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { deliveryPrices, orders, products, type OrderItem } from "@/db/schema";
import { PRODUCT } from "@/lib/catalog";
import { isDashboardAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isDashboardAuthenticated())) {
    return Response.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const result = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(100);
    return Response.json({ orders: result });
  } catch {
    return Response.json({ error: "تعذر الاتصال بقاعدة البيانات" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<{
      productId: number;
      customerName: string;
      phone: string;
      wilaya: string;
      commune: string;
      address: string;
      quantity: number;
      color: string;
      size: string;
      deliveryType: string;
      items: Partial<{
        productId: number | null;
        nameAr: string;
        nameFr: string;
        image: string;
        color: string;
        size: string;
        quantity: number;
        price: number;
      }>[];
    }>;
    const required = [body.customerName, body.phone, body.wilaya, body.commune, body.address];
    if (required.some((value) => !value || !String(value).trim())) {
      return Response.json({ error: "الرجاء إكمال جميع المعلومات المطلوبة" }, { status: 400 });
    }

    // عناصر الطلب: قائمة منتجات من السلة، أو منتج واحد (الطلب المباشر)
    const inputItems = Array.isArray(body.items) && body.items.length > 0
      ? body.items
      : [{
          productId: body.productId ?? null,
          color: body.color,
          size: body.size,
          quantity: body.quantity,
        }];
    const cleanItems = inputItems.filter((item) => Number(item.quantity) > 0);
    if (cleanItems.length === 0) {
      return Response.json({ error: "السلة فارغة" }, { status: 400 });
    }

    // الأسعار تُحسب من قاعدة البيانات وليس مما يرسله المتصفح
    const productIds = cleanItems
      .map((item) => Number(item.productId))
      .filter((id) => Number.isFinite(id) && id > 0);
    const dbProducts = productIds.length > 0
      ? await db.select().from(products).where(inArray(products.id, productIds))
      : [];

    const items: OrderItem[] = cleanItems.map((item) => {
      const productId = Number(item.productId);
      const product = Number.isFinite(productId) && productId > 0
        ? dbProducts.find((entry) => entry.id === productId)
        : undefined;
      const quantity = Math.max(1, Math.min(10, Number(item.quantity) || 1));
      const unitPrice = product ? Number(product.price) : Number(item.price) > 0 ? Number(item.price) : PRODUCT.price;
      return {
        productId: product ? product.id : null,
        nameAr: product?.nameAr ?? String(item.nameAr ?? ""),
        nameFr: product?.nameFr ?? String(item.nameFr ?? ""),
        image: product?.images?.[0] ?? String(item.image ?? ""),
        color: String(item.color ?? "").trim(),
        size: String(item.size ?? "").trim(),
        quantity,
        unitPrice,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    const deliveryType = body.deliveryType === "office" ? "office" : "home";
    const wilayaCode = String(body.wilaya).trim();
    const [wilayaDelivery] = await db.select().from(deliveryPrices).where(eq(deliveryPrices.wilaya, wilayaCode)).limit(1);
    const firstProduct = items.find((item) => item.productId !== null);
    const delivery = wilayaDelivery
      ? Number(deliveryType === "office" ? wilayaDelivery.officePrice : wilayaDelivery.homePrice)
      : 0;

    const totalPrice = subtotal + delivery;
    // طلب واحد يحتوي جميع منتجات السلة
    const [order] = await db.insert(orders).values({
      productId: firstProduct?.productId ?? null,
      customerName: String(body.customerName).trim(),
      phone: String(body.phone).trim(),
      wilaya: wilayaCode,
      commune: String(body.commune).trim(),
      address: String(body.address).trim(),
      quantity: totalQuantity,
      color: items.length === 1 ? items[0].color : "",
      size: items.length === 1 ? items[0].size : "",
      unitPrice: items.length === 1 ? String(items[0].unitPrice) : String(subtotal),
      deliveryPrice: String(delivery),
      totalPrice: String(totalPrice),
      status: "new",
      deliveryType,
      items,
    }).returning();

    return Response.json({ order }, { status: 201 });
  } catch {
    return Response.json({ error: "تعذر حفظ الطلب، يرجى المحاولة لاحقاً" }, { status: 500 });
  }
}
