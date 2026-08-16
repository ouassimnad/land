import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { PRODUCT } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
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
      customerName: string;
      phone: string;
      wilaya: string;
      commune: string;
      address: string;
      quantity: number;
      color: string;
      size: string;
    }>;
    const required = [body.customerName, body.phone, body.wilaya, body.commune, body.address, body.color, body.size];
    if (required.some((value) => !value || !String(value).trim())) {
      return Response.json({ error: "الرجاء إكمال جميع المعلومات المطلوبة" }, { status: 400 });
    }

    const [activeProduct] = await db
      .select()
      .from(products)
      .where(eq(products.active, true))
      .orderBy(desc(products.createdAt))
      .limit(1);

    const price = activeProduct ? Number(activeProduct.price) : PRODUCT.price;
    const delivery = PRODUCT.delivery; // assuming delivery is static

    const quantity = Math.max(1, Math.min(10, Number(body.quantity) || 1));
    const totalPrice = price * quantity + delivery;
    const [order] = await db.insert(orders).values({
      customerName: String(body.customerName).trim(),
      phone: String(body.phone).trim(),
      wilaya: String(body.wilaya).trim(),
      commune: String(body.commune).trim(),
      address: String(body.address).trim(),
      quantity,
      color: String(body.color).trim(),
      size: String(body.size).trim(),
      unitPrice: String(price),
      deliveryPrice: String(delivery),
      totalPrice: String(totalPrice),
      status: "new",
    }).returning();

    return Response.json({ order }, { status: 201 });
  } catch {
    return Response.json({ error: "تعذر حفظ الطلب، يرجى المحاولة لاحقاً" }, { status: 500 });
  }
}
