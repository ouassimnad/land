import { isDashboardAuthenticated, getSupabaseAuthConfig } from "@/lib/auth";

export const dynamic = "force-dynamic";

// مجلد التخزين في Supabase Storage (يجب إنشاؤه عاماً — راجع خطوات الإعداد)
const STORAGE_BUCKET = "products";

export async function POST(request: Request) {
  if (!(await isDashboardAuthenticated())) {
    return Response.json({ error: "غير مصرح" }, { status: 401 });
  }

  const config = getSupabaseAuthConfig();
  if (!config) {
    return Response.json({ error: "إعدادات Supabase غير مكتملة" }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "لم يتم اختيار أي صورة" }, { status: 400 });
    }

    // التحقق من نوع الملف
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: "نوع الملف غير مدعوم. استخدم JPG أو PNG أو WebP" }, { status: 400 });
    }

    // الحد الأقصى 5 ميغابايت
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ error: "حجم الصورة يجب أن لا يتجاوز 5 ميغابايت" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();

    // اسم ملف فريد
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `product-${Date.now()}.${ext}`;

    // رفع الصورة إلى Supabase Storage عبر REST API
    const uploadRes = await fetch(`${config.url}/storage/v1/object/${STORAGE_BUCKET}/${filename}`, {
      method: "POST",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        "Content-Type": file.type,
      },
      body: Buffer.from(bytes),
    });

    if (!uploadRes.ok) {
      const details = await uploadRes.text().catch(() => "");
      return Response.json({ error: "تعذر رفع الصورة", details }, { status: 502 });
    }

    const imageUrl = `${config.url}/storage/v1/object/public/${STORAGE_BUCKET}/${filename}`;
    return Response.json({ url: imageUrl }, { status: 201 });
  } catch {
    return Response.json({ error: "تعذر رفع الصورة" }, { status: 500 });
  }
}
