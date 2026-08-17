import Link from "next/link";

export const metadata = {
  title: "لماذا Clochette | Clochette",
};

const REASONS = [
  "اختيارات منتقاة بعناية — كل موديل يمر بفحص دقيق للخامة والقصّة قبل أن يصل إلى المتجر.",
  "الدفع عند الاستلام — تدفعين فقط بعد أن تصلكِ طلبيتكِ وتعاينينها بنفسك.",
  "توصيل إلى 58 ولاية — أينما كنتِ في الجزائر، طلبكِ يصلكِ حتى باب المنزل.",
  "تغليف أنيق — طلبيتكِ تصلكِ مغلفة بذوق رفيع يليق بكِ.",
  "خدمة قريبة منكِ — فريقنا يجيب على استفساراتكِ بسرعة عبر صفحاتنا على مواقع التواصل.",
];

export default function WhyClochettePage() {
  return (
    <div className="min-h-screen bg-[#fffdfb] text-[#2a2522]" dir="rtl">
      <header className="border-b border-[#e8e2dc]" style={{ backgroundColor: "#E7D0D0" }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" aria-label="Clochette">
            <img alt="Clochette logo" src="/logo.png" className="h-8 w-auto" />
          </Link>
          <Link href="/" className="text-sm font-bold text-[#617549] transition-opacity hover:opacity-80">
            العودة للمتجر
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-8 text-3xl font-bold text-[#617549] md:text-4xl">لماذا Clochette</h1>
        <p className="mb-10 text-lg leading-loose">
          لأن التفاصيل تصنع الفرق، حرصنا أن تكون تجربتكِ معنا مختلفة من البداية إلى النهاية:
        </p>
        <ul className="space-y-5 text-lg leading-relaxed">
          {REASONS.map((reason) => (
            <li key={reason} className="flex gap-3">
              <span className="text-[#617549]" aria-hidden="true">✦</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
