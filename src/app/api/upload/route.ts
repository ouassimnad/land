import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "لم يتم اختيار أي صورة" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: "نوع الملف غير مدعوم. استخدم JPG أو PNG أو WebP" }, { status: 400 });
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ error: "حجم الصورة يجب أن لا يتجاوز 5 ميغابايت" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `product-${Date.now()}.${ext}`;

    // Ensure uploads directory exists inside public
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/${filename}`;
    return Response.json({ url: imageUrl }, { status: 201 });
  } catch {
    return Response.json({ error: "تعذر رفع الصورة" }, { status: 500 });
  }
}
