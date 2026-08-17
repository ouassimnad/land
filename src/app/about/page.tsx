import Link from "next/link";

export const metadata = {
  title: "من نحن | Clochette",
};

export default function AboutPage() {
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
        <h1 className="mb-8 text-3xl font-bold text-[#617549] md:text-4xl">من نحن</h1>
        <div className="space-y-6 text-lg leading-loose">
          <p>
            وُلدت Clochette من حب التفاصيل والأناقة الهادئة. نحن متجر جزائري نسائي نختار لكِ قطعاً تجمع بين الراحة والجمال، بخامات ناعمة وقصّات مدروسة ترافق يومكِ ومناسباتكِ.
          </p>
          <p>
            نؤمن أن الأناقة لا تحتاج إلى تعقيد؛ قطعة واحدة مختارة بعناية تكفي لتغيير إطلالتكِ بالكامل. لذلك ننتقي كل موديل في متجرنا كما لو كنا نختاره لأنفسنا.
          </p>
          <p>
            نوصل إلى 58 ولاية، والدفع عند الاستلام بعد معاينة طلبيتكِ — لتتسوقي بثقة وراحة بال تامة.
          </p>
        </div>
      </main>
    </div>
  );
}
