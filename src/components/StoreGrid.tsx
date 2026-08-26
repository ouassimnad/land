"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import Link from "next/link";
import { type Locale, formatPrice } from "@/lib/catalog";
import { readCart, writeCart, type StoredCartLine } from "@/lib/cart";
import AnnouncementBar from "@/components/AnnouncementBar";
import type { InferSelectModel } from "drizzle-orm";
import { products, reviews as reviewsTable } from "@/db/schema";

type Product = InferSelectModel<typeof products>;
type Review = InferSelectModel<typeof reviewsTable>;
type SocialLinks = { instagram: string; facebook: string; tiktok: string };

type IconName = "menu" | "close" | "search" | "bag" | "instagram" | "facebook" | "tiktok" | "cash" | "medal" | "heart";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  let content: ReactNode;
  switch (name) {
    case "menu":
      content = <><path d="M3 6h18M3 12h13M3 18h18" /></>;
      break;
    case "close":
      content = <><path d="m5 5 14 14M19 5 5 19" /></>;
      break;
    case "search":
      content = <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>;
      break;
    case "bag":
      content = <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></>;
      break;
    case "instagram":
      content = <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.7" r=".8" fill="currentColor" stroke="none" /></>;
      break;
    case "facebook":
      content = <><path d="M14 8h3V4h-3c-3.3 0-5 1.9-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z" fill="currentColor" stroke="none" /></>;
      break;
    case "tiktok":
      content = <><path d="M15 4v10.2a4.8 4.8 0 1 1-4-4.7v3.1a1.8 1.8 0 1 0 1 1.6V4h3Z" fill="currentColor" stroke="none" /><path d="M15 4c.5 1.6 1.5 2.5 3 2.8" /></>;
      break;
    case "cash":
      content = <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 12h.01M18 12h.01" /></>;
      break;
    case "medal":
      content = <><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1.7 7L12 18l5.2 3-1.7-7" /></>;
      break;
    case "heart":
      content = <><path d="M19 14c1.5-1.46 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.04 3 5.5l7 7Z" /></>;
      break;
  }
  return <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">{content}</svg>;
}

const COPY = {
  ar: {
    announcement: ["مرحبا بك في متجر Clochette", "متوفر توصيل 58 ولاية", "الدفع عند الاستلام بعد تفقد الطلبية", "نشكركم عل ثقتم بنا"],
    bestSellers: "المنتجات الأكثر مبيعاً",
    discounts: "التخفيضات",
    reviewsTitle: "آراء عميلاتنا",
    about: "من نحن",
    whyUs: "لماذا Clochette",
    contact: "اتصل بنا",
    search: "بحث",
    cart: "السلة",
    searchPlaceholder: "ابحثي عن منتج…",
    noResults: "لا توجد نتائج مطابقة لبحثك",
    cartTitle: "سلة التسوق",
    cartEmpty: "سلتك فارغة حالياً",
    close: "إغلاق",
    remove: "حذف",
    checkout: "إتمام الطلب",
    total: "المجموع",
    footerText: "قطع تشبهكِ، وتفاصيل تبقى معكِ.",
    rights: "© 2026 Clochette. كل الحقوق محفوظة.",
    shopNow: "تسوّقي الآن",
    viewProduct: "عرض المنتج",
    menu: "القائمة",
    follow: "تابعينا على",
    pages: "الصفحات",
    info: "معلومات",
    exchangePolicy: "الدفع عند الاستلام بعد تفقد الطلبية",
    deliveryAll: "توصيل متوفر لـ 58 ولاية",
    trust: "شكراً لثقتكن بنا",
    elegantDesc: "Nous sommes une marque dédiée à la création de robes haute couture, conçues avec des matières authentiques et un souci du détail exceptionnel. Notre univers est complété par une collection de prêt-à-porter alliant élégance et modernité.",
    trustPayment: "الدفع عند الاستلام",
    trustQuality: "مواد عالية الجودة",
    trustCommunity: "مجتمع ووفاء",
    builtBy: "تم البناء من قبل",
  },
  fr: {
    announcement: ["Bienvenue chez Clochette", "Livraison disponible sur 58 wilayas", "Paiement à la livraison après vérification", "Merci pour votre confiance"],
    bestSellers: "Meilleures ventes",
    discounts: "Promotions",
    reviewsTitle: "Avis clientes",
    about: "À propos",
    whyUs: "Pourquoi Clochette",
    contact: "Contactez-nous",
    search: "Recherche",
    cart: "Panier",
    searchPlaceholder: "Rechercher un produit…",
    noResults: "Aucun résultat trouvé",
    cartTitle: "Panier",
    cartEmpty: "Votre panier est vide pour le moment",
    close: "Fermer",
    remove: "Retirer",
    checkout: "Commander",
    total: "Total",
    footerText: "Des pièces qui vous ressemblent, des détails qui restent.",
    rights: "© 2026 Clochette. Tous droits réservés.",
    shopNow: "Acheter",
    viewProduct: "Voir le produit",
    menu: "Menu",
    follow: "Suivez-nous",
    pages: "Pages",
    info: "Informations",
    exchangePolicy: "Paiement à la livraison après vérification",
    deliveryAll: "Livraison disponible sur 58 wilayas",
    trust: "Merci pour votre confiance",
    elegantDesc: "Nous sommes une marque dédiée à la création de robes haute couture, conçues avec des matières authentiques et un souci du détail exceptionnel. Notre univers est complété par une collection de prêt-à-porter alliant élégance et modernité.",
    trustPayment: "Paiement à la livraison",
    trustQuality: "Matériaux de haute qualité",
    trustCommunity: "Communauté et fidélité",
    builtBy: "Construit par",
  }
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col items-center will-change-transform animate-[sweep-in-out_3.5s_ease-in-out_infinite]">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-[#2a2522]">{children}</h2>
        <span className="block h-[3px] w-28 rounded-full bg-[#2a2522] mt-4" />
      </div>
    </div>
  );
}

// خط فاصل في المنتصف بين الأقسام
function SectionDivider() {
  return (
    <div aria-hidden="true" className="relative z-10 mx-auto my-14 h-px w-full max-w-6xl bg-[#d8cfc6]">
      <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#a1688a]" />
    </div>
  );
}

function ProductCard({ product, locale, viewLabel }: { product: Product; locale: Locale; viewLabel: string }) {
  const productName = locale === "ar" ? product.nameAr : product.nameFr;
  const discount = product.discount ?? 0;
  const firstImage = product.images && product.images.length > 0 ? product.images[0] : "/placeholder.jpg";
  const oldPrice = discount > 0 ? Math.round(Number(product.price) / (1 - discount / 100)) : null;
  return (
    <div className="overflow-hidden border border-[#e8e2dc] bg-white shadow-sm">
      <Link href={`/product/${product.id}`} className="relative block aspect-[3/4] overflow-hidden bg-[#e3dedc]">
        <img
          src={firstImage}
          alt={productName}
          className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-sm font-medium tracking-wide rounded-full shadow-sm text-[#2a2522]">
            -{discount}%
          </span>
        )}
      </Link>
      <div className="bg-[#E7D0D0] px-4 py-3 flex items-center justify-between gap-2">
        <span className="font-medium text-[#2a2522] truncate">{productName}</span>
        <span className="font-medium text-[#2a2522] whitespace-nowrap">
          {formatPrice(Number(product.price), locale)}
          {oldPrice && <span className="text-xs text-[#857d76] line-through ms-1">{formatPrice(oldPrice, locale)}</span>}
        </span>
      </div>
      <Link href={`/product/${product.id}`} className="block bg-[#a1688a] text-[#fffaf8] text-center py-3 text-sm font-bold transition-opacity hover:opacity-90">
        {viewLabel}
      </Link>
    </div>
  );
}

function DiscountCard({ product, locale, viewLabel }: { product: Product; locale: Locale; viewLabel: string }) {
  const productName = locale === "ar" ? product.nameAr : product.nameFr;
  const discount = product.discount ?? 0;
  const firstImage = product.images && product.images.length > 0 ? product.images[0] : "/placeholder.jpg";
  return (
    <div className="w-64 md:w-72 shrink-0 snap-start overflow-hidden border border-[#e8e2dc] bg-white shadow-sm">
      <Link href={`/product/${product.id}`} className="relative block aspect-[3/4] overflow-hidden bg-[#e3dedc]">
        <img
          src={firstImage}
          alt={productName}
          className="object-cover w-full h-full"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-sm font-medium tracking-wide rounded-full shadow-sm text-[#2a2522]">
            -{discount}%
          </span>
        )}
      </Link>
      <div className="bg-[#E7D0D0] px-4 py-3 flex items-center justify-between gap-2">
        <span className="font-medium text-[#2a2522] truncate">{productName}</span>
        <span className="font-medium text-[#2a2522] whitespace-nowrap">{formatPrice(Number(product.price), locale)}</span>
      </div>
      <Link href={`/product/${product.id}`} className="block bg-[#a1688a] text-[#fffaf8] text-center py-3 text-sm font-bold transition-opacity hover:opacity-90">
        {viewLabel}
      </Link>
    </div>
  );
}

export default function StoreGrid({ products, reviews, social }: { products: Product[]; reviews: Review[]; social?: SocialLinks | null }) {
  const locale: Locale = "ar";
  const socialLinks: SocialLinks = {
    instagram: social?.instagram?.trim() || "https://www.instagram.com",
    facebook: social?.facebook?.trim() || "https://www.facebook.com",
    tiktok: social?.tiktok?.trim() || "https://www.tiktok.com",
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartLines, setCartLines] = useState<StoredCartLine[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const t = COPY[locale];

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  // السلة محفوظة في localStorage — تبقى بعد تحديث أو تغيير الصفحة
  useEffect(() => {
    setCartLines(readCart());
    const syncCart = () => setCartLines(readCart());
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  const removeLine = (key: string) => {
    setCartLines((lines) => {
      const next = lines.filter((line) => line.key !== key);
      writeCart(next);
      return next;
    });
  };

  const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = cartLines.reduce((sum, line) => sum + line.quantity * line.price, 0);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleProducts = normalizedQuery
    ? products.filter((product) => `${product.nameAr} ${product.nameFr}`.toLowerCase().includes(normalizedQuery))
    : products;
  const discountedProducts = normalizedQuery
    ? []
    : products.filter((product) => (product.discount ?? 0) > 0 || product.category?.trim() === "التخفيضات");
  const visibleReviews = reviews.filter((review) => review.image && review.image.trim());

  const uncategorizedProducts = visibleProducts.filter((product) => !product.category || !product.category.trim());
  const categorySections: { name: string; items: Product[] }[] = [];
  for (const product of visibleProducts) {
    const key = product.category?.trim();
    if (!key || key === "التخفيضات") continue;
    let section = categorySections.find((s) => s.name === key);
    if (!section) {
      section = { name: key, items: [] };
      categorySections.push(section);
    }
    section.items.push(product);
  }

  return (
    <div className="page-noise min-h-screen" dir={locale === "ar" ? "rtl" : "ltr"}>
      <AnnouncementBar items={t.announcement} dir={locale === "ar" ? "rtl" : "ltr"} />
      <header className="header-wrap relative z-10 backdrop-blur-md border-b border-[#e8e2dc]" style={{ backgroundColor: "#E7D0D0" }}>
        <div className="header-inner mx-auto max-w-7xl px-4 flex justify-between items-center py-4 md:hidden">
          <div className="w-1/3 flex justify-start">
            <button aria-label={t.menu} className="menu-button" onClick={() => { setMenuOpen(true); setCartOpen(false); }} type="button">
              <Icon name="menu" size={21} /> <span>{t.menu}</span>
            </button>
          </div>
          <Link href="/" className="logo-lockup flex justify-center w-1/3" aria-label="Clochette">
            <img alt="Clochette logo" src="/logo.png" className="h-8 w-auto" />
          </Link>
          <div className="flex justify-end items-center gap-5 w-1/3">
            <button
              aria-label={t.search}
              className="icon-button"
              onClick={() => {
                if (searchOpen) setSearchQuery("");
                setSearchOpen(!searchOpen);
              }}
              type="button"
            >
              <Icon name="search" size={21} />
            </button>
            <button aria-label={t.cart} className="icon-button relative" onClick={() => { setCartOpen(true); setMenuOpen(false); }} type="button">
              <Icon name="bag" size={21} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#a1688a] px-1 text-[10px] font-bold text-[#fffaf8]">{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        <div className="hidden md:flex mx-auto max-w-7xl px-6 items-center justify-between gap-6 py-4">
          <Link href="/" className="logo-lockup shrink-0" aria-label="Clochette">
            <img alt="Clochette logo" src="/logo.png" className="h-10 w-auto" />
          </Link>
          <nav className="flex items-center gap-8">
            <Link className="text-sm font-medium text-[#2a2522] transition-colors hover:text-[#a1688a]" href="/about">{t.about}</Link>
            <Link className="text-sm font-medium text-[#2a2522] transition-colors hover:text-[#a1688a]" href="/why-clochette">{t.whyUs}</Link>
            <Link className="text-sm font-medium text-[#2a2522] transition-colors hover:text-[#a1688a]" href="/contact">{t.contact}</Link>
          </nav>
          <div className="flex items-center gap-4 shrink-0">
            <form
              className="flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-4 py-2"
              role="search"
              onSubmit={(event) => event.preventDefault()}
            >
              <Icon name="search" size={16} />
              <input
                className="w-40 bg-transparent text-sm text-[#2a2522] outline-none placeholder:text-[#857d76]"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t.searchPlaceholder}
                type="search"
                value={searchQuery}
              />
            </form>
            <button aria-label={t.cart} className="icon-button relative" onClick={() => { setCartOpen(true); setMenuOpen(false); }} type="button">
              <Icon name="bag" size={21} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#a1688a] px-1 text-[10px] font-bold text-[#fffaf8]">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className={`search-bar md:hidden ${searchOpen ? "open" : ""}`}>
        <div className="search-bar-inner">
          <form
            className="search-form"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              searchInputRef.current?.blur();
            }}
          >
            <div className="search-field">
              <Icon name="search" size={18} />
              <input
                ref={searchInputRef}
                className="search-input"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t.searchPlaceholder}
                type="search"
                value={searchQuery}
              />
              <button className="search-submit" type="submit">{t.search}</button>
            </div>
          </form>
        </div>
      </div>

      <div className={`side-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <aside aria-label={t.menu} className={`side-panel ${menuOpen ? "open" : ""}`}>
        <button aria-label={t.menu} className="side-close" onClick={() => setMenuOpen(false)} type="button"><Icon name="close" size={23} /></button>
        <div className="side-brand">Clochette / 2026</div>
        <nav className="side-links">
          <Link className="side-link" href="/about" onClick={() => setMenuOpen(false)}>{t.about}</Link>
          <Link className="side-link" href="/why-clochette" onClick={() => setMenuOpen(false)}>{t.whyUs}</Link>
          <Link className="side-link" href="/contact" onClick={() => setMenuOpen(false)}>{t.contact}</Link>
        </nav>
        <div className="side-footer">
          <div className="mb-3 text-sm text-[#8a7b7d]">{t.follow}</div>
          <div className="social-row">
            <a aria-label="Instagram" href={socialLinks.instagram} rel="noreferrer" target="_blank"><Icon name="instagram" size={20} /></a>
            <a aria-label="TikTok" href={socialLinks.tiktok} rel="noreferrer" target="_blank"><Icon name="tiktok" size={20} /></a>
            <a aria-label="Facebook" href={socialLinks.facebook} rel="noreferrer" target="_blank"><Icon name="facebook" size={20} /></a>
          </div>
        </div>
      </aside>

      <div className={`side-overlay ${cartOpen ? "open" : ""}`} onClick={() => setCartOpen(false)} />
      <aside aria-label={t.cart} className={`side-panel cart-panel ${cartOpen ? "open" : ""}`}>
        <button aria-label={t.close} className="side-close" onClick={() => setCartOpen(false)} type="button"><Icon name="close" size={23} /></button>
        <h2 className="cart-title">{t.cartTitle}</h2>
        {cartLines.length === 0 ? (
          <div className="cart-empty">
            <Icon name="bag" size={42} />
            <p>{t.cartEmpty}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 mt-6 overflow-y-auto">
              {cartLines.map((line) => (
                <div key={line.key} className="flex items-center gap-3 rounded-2xl border border-[#e8e2dc] p-3">
                  <img src={line.image} alt="" className="w-14 h-[4.5rem] object-cover rounded-xl" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[#2a2522] truncate">{locale === "ar" ? line.nameAr : line.nameFr}</div>
                    <div className="text-xs text-[#857d76] mt-0.5">{line.color}{line.size ? ` · ${line.size}` : ""} × {line.quantity}</div>
                    <div className="text-sm font-bold text-[#a1688a] mt-1">{formatPrice(line.price * line.quantity, locale)}</div>
                  </div>
                  <button type="button" aria-label={t.remove} onClick={() => removeLine(line.key)} className="text-red-500 hover:text-red-700 p-1">
                    <Icon name="close" size={17} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-5 border-t border-[#e8e2dc]">
              <div className="flex justify-between items-center font-bold text-[#a1688a] mb-4">
                <span>{t.total}</span>
                <span>{formatPrice(cartTotal, locale)}</span>
              </div>
              <Link href="/cart" onClick={() => setCartOpen(false)} className="flex items-center justify-center gap-2 rounded-full bg-[#a1688a] text-[#fffaf8] px-6 py-3.5 text-sm font-bold transition-opacity hover:opacity-90">
                {t.checkout}
              </Link>
            </div>
          </>
        )}
      </aside>

      <section className="relative w-full h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-x-0 bottom-16 flex justify-center z-10">
          <h2 className="text-white text-4xl md:text-6xl font-serif text-center drop-shadow-md tracking-wider">
            {locale === "ar" ? "اكتشفي الأناقة" : "Découvrez l'élégance"}
          </h2>
        </div>
      </section>

      {(uncategorizedProducts.length > 0 || visibleProducts.length === 0) && (
        <>
          <div
            className="relative z-10 overflow-hidden py-10"
            style={{ backgroundImage: "url('/most-shoping.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div aria-hidden="true" className="absolute inset-0 bg-[#faf6ef]/70" />
            <div className="relative">
              <SectionTitle>{t.bestSellers}</SectionTitle>
            </div>
          </div>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
              {uncategorizedProducts.map((product) => <ProductCard key={product.id} product={product} locale={locale} viewLabel={t.viewProduct} />)}
              {visibleProducts.length === 0 && (
                <div className="col-span-full text-center py-24 text-[#857d76]">
                  {normalizedQuery ? t.noResults : "No products available."}
                </div>
              )}
            </div>
          </main>
        </>
      )}

      {uncategorizedProducts.length > 0 && categorySections.length > 0 && !normalizedQuery && <SectionDivider />}

      {categorySections.map((section, index) => (
        <div key={section.name}>
          {index > 0 && !normalizedQuery && <SectionDivider />}
          <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10 ${uncategorizedProducts.length === 0 && index === 0 ? "pt-16" : ""}`}>
            <SectionTitle>{section.name}</SectionTitle>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12 mt-12">
              {section.items.map((product) => <ProductCard key={product.id} product={product} locale={locale} viewLabel={t.viewProduct} />)}
            </div>
          </section>
        </div>
      ))}

      {discountedProducts.length > 0 && (uncategorizedProducts.length > 0 || categorySections.length > 0) && !normalizedQuery && <SectionDivider />}

      {discountedProducts.length > 0 && (
        <>
          <div
            className="relative z-10 overflow-hidden py-1"
            style={{ backgroundImage: "url('/discount.png')", backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div aria-hidden="true" className="absolute inset-0 bg-[#faf6ef]/70" />
            <div className="relative">
              <SectionTitle>{t.discounts}</SectionTitle>
            </div>
          </div>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20 relative z-10">
            <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
              {discountedProducts.map((product) => <DiscountCard key={product.id} product={product} locale={locale} viewLabel={t.viewProduct} />)}
            </div>
          </section>
        </>
      )}

      {!normalizedQuery && <SectionDivider />}

      {!normalizedQuery && (
        <section
          className="relative z-10 mb-20 overflow-hidden"
          style={{ backgroundImage: "url('/background-2.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-black/40" />
          <div className="relative max-w-7xl mx-auto px-6 py-32 md:py-48 text-center">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white">Elegant Design</h2>
            <span className="block h-[3px] w-16 rounded-full bg-white/80 mx-auto mt-4" />
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-2xl leading-9 md:leading-10 text-white">{t.elegantDesc}</p>
          </div>
        </section>
      )}

      {!normalizedQuery && visibleReviews.length > 0 && <SectionDivider />}

      {!normalizedQuery && visibleReviews.length > 0 && (
        <>
          <div className="relative z-10 py-10 bg-[#D5A7AB]/25">
            <SectionTitle>{t.reviewsTitle}</SectionTitle>
          </div>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20 relative z-10">
            <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
              {visibleReviews.map((review) => (
                <img
                  key={review.id}
                  src={review.image}
                  alt={t.reviewsTitle}
                  className="h-80 w-auto shrink-0 snap-start rounded-2xl border border-[#e8e2dc] object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          </section>
        </>
      )}

      {!normalizedQuery && <SectionDivider />}

      {!normalizedQuery && (
        <section
          className="relative z-10 overflow-hidden pb-28 md:pb-36"
          style={{ backgroundImage: "url('/background.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-black/40" />
          <div className="relative max-w-7xl mx-auto px-4 pt-24 md:pt-32 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                { icon: "cash", text: t.trustPayment },
                { icon: "medal", text: t.trustQuality },
                { icon: "heart", text: t.trustCommunity },
              ] as const).map((item) => (
                <div key={item.text} className="bg-white/10 backdrop-blur-sm border border-white/25 text-[#fffaf8] px-6 py-10 text-center shadow-sm flex flex-col items-center gap-4">
                  <Icon name={item.icon} size={30} />
                  <span className="text-base font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!normalizedQuery && <SectionDivider />}

      <footer className="footer mt-4 relative z-10 border-t border-[#e8e2dc]" style={{ backgroundColor: "#E7D0D0" }}>
        <div className="footer-top max-w-7xl mx-auto px-4 pt-14 pb-10 flex flex-col items-center text-center">
          <img alt="Clochette logo" src="/logo.png" className="h-14 w-auto" />
          <p className="footer-copy mt-5 max-w-md text-[#2a2522] leading-relaxed">{t.footerText}</p>

          <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3">
            <nav aria-label={t.pages} className="flex flex-col items-center gap-3">
              <span className="text-sm font-bold text-[#2a2522]">{t.pages}</span>
              <Link className="text-sm text-[#857d76] transition-colors hover:text-[#a1688a]" href="/about">{t.about}</Link>
              <Link className="text-sm text-[#857d76] transition-colors hover:text-[#a1688a]" href="/why-clochette">{t.whyUs}</Link>
              <Link className="text-sm text-[#857d76] transition-colors hover:text-[#a1688a]" href="/contact">{t.contact}</Link>
            </nav>

            <div className="flex flex-col items-center gap-3">
              <span className="text-sm font-bold text-[#2a2522]">{t.info}</span>
              <span className="text-sm text-[#857d76]">{t.deliveryAll}</span>
              <span className="text-sm text-[#857d76]">{t.exchangePolicy}</span>
              <span className="text-sm text-[#857d76]">{t.trust}</span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <span className="text-sm font-bold text-[#2a2522]">{t.follow}</span>
              <div className="social-row">
                <a aria-label="Instagram" href={socialLinks.instagram} rel="noreferrer" target="_blank"><Icon name="instagram" size={20} /></a>
                <a aria-label="TikTok" href={socialLinks.tiktok} rel="noreferrer" target="_blank"><Icon name="tiktok" size={20} /></a>
                <a aria-label="Facebook" href={socialLinks.facebook} rel="noreferrer" target="_blank"><Icon name="facebook" size={20} /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom max-w-7xl mx-auto px-4 py-6 flex flex-col items-center gap-2 text-sm text-[#857d76] border-t border-[#e8e2dc]/50">
          <span>{t.rights}</span>
          <span className="text-xs">
            {t.builtBy}{" "}
            <a className="font-semibold text-[#a1688a] hover:underline" href="https://www.instagram.com/ne__dev/" rel="noreferrer" target="_blank">Ne__dev</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
