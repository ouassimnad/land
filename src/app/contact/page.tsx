import Link from "next/link";

export const metadata = {
  title: "اتصل بنا | Clochette",
};

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "TikTok", href: "https://www.tiktok.com" },
  { label: "Facebook", href: "https://www.facebook.com" },
];

export default function ContactPage() {
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
        <h1 className="mb-8 text-3xl font-bold text-[#617549] md:text-4xl">اتصل بنا</h1>
        <div className="space-y-6 text-lg leading-loose">
          <p>
            يسعدنا تواصلكِ معنا في أي وقت. فريق Clochette جاهز للإجابة عن استفساراتكِ حول المنتجات، الطلبات، أو التوصيل.
          </p>
          <p>نجيب على رسائلكِ يومياً من 9:00 صباحاً إلى 9:00 مساءً.</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#e8e2dc] px-6 py-3 font-bold text-[#617549] transition-colors hover:bg-[#E7D0D0]"
            >
              {social.label}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
