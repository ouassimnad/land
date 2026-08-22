"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PRODUCT as STATIC_PRODUCT, type Locale, formatPrice } from "@/lib/catalog";
import { readCart, writeCart, type StoredCartLine } from "@/lib/cart";
import AnnouncementBar from "@/components/AnnouncementBar";

type IconName =
  | "menu"
  | "close"
  | "arrow"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "truck"
  | "shield"
  | "cash"
  | "gift"
  | "check"
  | "bag";

type Copy = {
  announcement: string[];
  menu: string;
  about: string;
  whyUs: string;
  contact: string;
  follow: string;
  language: string;
  backToStore: string;
  color: string;
  size: string;
  choose: string;
  quantity: string;
  orderNow: string;
  descriptionTitle: string;
  deliveryNote: string;
  codNote: string;
  packagingNote: string;
  total: string;
  addToCart: string;
  added: string;
  cartTitle: string;
  cartEmpty: string;
  close: string;
  remove: string;
  checkout: string;
  footerText: string;
  rights: string;
};

const COPY: Record<Locale, Copy> = {
  ar: {
    announcement: ["مرحبا بك في متجر Clochette", "متوفر توصيل 58 ولاية", "الدفع عند الاستلام بعد تفقد الطلبية", "نشكركم عل ثقتم بنا"],
    menu: "القائمة",
    about: "من نحن",
    whyUs: "لماذا Clochette",
    contact: "اتصل بنا",
    follow: "تابعينا على",
    language: "اللغة",
    backToStore: "العودة للمتجر",
    color: "اللون",
    size: "المقاس",
    choose: "اختاري",
    quantity: "الكمية",
    orderNow: "اطلبي الآن",
    descriptionTitle: "الوصف",
    deliveryNote: "توصيل إلى 58 ولاية خلال 24–72 ساعة",
    codNote: "الدفع عند الاستلام بعد تفقد الطلبية",
    packagingNote: "تغليف أنيق ومميز",
    total: "المجموع",
    addToCart: "أضف للسلة",
    added: "تمت الإضافة ✓",
    cartTitle: "سلة التسوق",
    cartEmpty: "سلتك فارغة حالياً",
    close: "إغلاق",
    remove: "حذف",
    checkout: "إتمام الطلب",
    footerText: "قطع تشبهكِ، وتفاصيل تبقى معكِ.",
    rights: "© 2026 Clochette. كل الحقوق محفوظة.",
  },
  fr: {
    announcement: ["Bienvenue chez Clochette", "Livraison disponible sur 58 wilayas", "Paiement à la livraison après vérification", "Merci pour votre confiance"],
    menu: "Menu",
    about: "À propos",
    whyUs: "Pourquoi Clochette",
    contact: "Contactez-nous",
    follow: "Suivez-nous",
    language: "Langue",
    backToStore: "Retour à la boutique",
    color: "Couleur",
    size: "Taille",
    choose: "Choisir",
    quantity: "Quantité",
    orderNow: "Commander",
    descriptionTitle: "Description",
    deliveryNote: "Livraison dans 58 wilayas sous 24–72 h",
    codNote: "Paiement à la livraison après vérification",
    packagingNote: "Emballage soigné et élégant",
    total: "Total",
    addToCart: "Ajouter au panier",
    added: "Ajouté ✓",
    cartTitle: "Panier",
    cartEmpty: "Votre panier est vide pour le moment",
    close: "Fermer",
    remove: "Retirer",
    checkout: "Commander",
    footerText: "Des pièces qui vous ressemblent, des détails qui restent.",
    rights: "© 2026 Clochette. Tous droits réservés.",
  },
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  let content: ReactNode;
  switch (name) {
    case "menu":
      content = <path d="M3 6h18M3 12h13M3 18h18" />;
      break;
    case "close":
      content = <path d="m5 5 14 14M19 5 5 19" />;
      break;
    case "arrow":
      content = <path d="M5 12h14M13 6l6 6-6 6" />;
      break;
    case "instagram":
      content = <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.7" r=".8" fill="currentColor" stroke="none" /></>;
      break;
    case "facebook":
      content = <path d="M14 8h3V4h-3c-3.3 0-5 1.9-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z" fill="currentColor" stroke="none" />;
      break;
    case "tiktok":
      content = <><path d="M15 4v10.2a4.8 4.8 0 1 1-4-4.7v3.1a1.8 1.8 0 1 0 1 1.6V4h3Z" fill="currentColor" stroke="none" /><path d="M15 4c.5 1.6 1.5 2.5 3 2.8" /></>;
      break;
    case "truck":
      content = <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>;
      break;
    case "shield":
      content = <><path d="M12 3 20 6v5c0 5-3.3 8.4-8 10-4.7-1.6-8-5-8-10V6l8-3Z" /><path d="m8.5 12 2.2 2.2 4.8-4.8" /></>;
      break;
    case "cash":
      content = <><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.6" /><path d="M6 9.5v.01M18 14.5v.01" /></>;
      break;
    case "gift":
      content = <path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7H8.5a2 2 0 1 1 2-2c1.5 0 1.5 2 1.5 2ZM12 7h3.5a2 2 0 1 0-2-2c-1.5 0-1.5 2-1.5 2Z" />;
      break;
    case "check":
      content = <path d="m5 12 4 4L19 6" />;
      break;
    case "bag":
      content = <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></>;
      break;
  }
  return <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">{content}</svg>;
}

export default function Storefront({ productData = STATIC_PRODUCT, productId = null }: { productData?: typeof STATIC_PRODUCT; productId?: number | null }) {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("ar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartLines, setCartLines] = useState<StoredCartLine[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [addedFlash, setAddedFlash] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(productData.colors[0]?.value ?? "");
  const [selectedSize, setSelectedSize] = useState(productData.sizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setCartLines(readCart());
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (cartReady) writeCart(cartLines);
  }, [cartLines, cartReady]);

  const t = COPY[locale];
  const isRtl = locale === "ar";
  const color = productData.colors.find((item) => item.value === selectedColor) ?? productData.colors[0];
  const colorLabel = color ? color[locale] : "";
  const discount = productData.oldPrice > productData.price ? Math.round((1 - productData.price / productData.oldPrice) * 100) : 0;
  const mainImage = productData.images[activeImage] ?? productData.images[0];
  const hasThumbs = productData.images.length > 1;
  const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = cartLines.reduce((sum, line) => sum + line.quantity * line.price, 0);

  const addToCart = () => {
    const key = `${colorLabel}-${selectedSize}`;
    const existing = cartLines.find((line) => line.key === key);
    const next = existing
      ? cartLines.map((line) => line.key === key ? { ...line, quantity: Math.min(10, line.quantity + quantity) } : line)
      : [...cartLines, {
          key,
          productId,
          nameAr: productData.name.ar,
          nameFr: productData.name.fr,
          price: productData.price,
          image: productData.images[0] ?? "",
          color: colorLabel,
          size: selectedSize,
          quantity,
        }];
    setCartLines(next);
    if (cartReady) writeCart(next);
    setAddedFlash(true);
    window.setTimeout(() => setAddedFlash(false), 1500);
  };

  const removeLine = (key: string) => {
    setCartLines((lines) => lines.filter((line) => line.key !== key));
  };

  const orderNow = () => {
    addToCart();
    router.push("/cart");
  };

  const benefits = [
    { icon: "truck", text: t.deliveryNote },
    { icon: "cash", text: t.codNote },
    { icon: "gift", text: t.packagingNote },
  ] as const;

  return (
    <div className="page-noise min-h-screen bg-[#faf6ef]" dir={isRtl ? "rtl" : "ltr"}>
      <AnnouncementBar items={t.announcement} dir={isRtl ? "rtl" : "ltr"} />

      <header className="sticky top-0 z-40 border-b border-[#e8e2dc] backdrop-blur-md" style={{ backgroundColor: "#E7D0D0" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
          <div className="w-1/3 flex justify-start items-center gap-4">
            <button aria-label={t.menu} className="icon-button" onClick={() => { setMenuOpen(true); setCartOpen(false); }} type="button">
              <Icon name="menu" size={21} />
            </button>
            <Link href="/" className="text-sm font-medium text-[#2a2522] hover:text-[#617549] transition-colors hidden sm:inline">{t.backToStore}</Link>
          </div>
          <Link href="/" className="w-1/3 flex justify-center" aria-label="Clochette">
            <img alt="Clochette logo" src="/logo.png" className="h-9 w-auto" />
          </Link>
          <div className="w-1/3 flex justify-end items-center">
            <button aria-label={t.cartTitle} className="icon-button relative" onClick={() => { setCartOpen(true); setMenuOpen(false); }} type="button">
              <Icon name="bag" size={21} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#617549] px-1 text-[10px] font-bold text-[#fffaf8]">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className={`side-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <aside aria-label={t.menu} className={`side-panel ${menuOpen ? "open" : ""}`}>
        <button aria-label={t.menu} className="side-close" onClick={() => setMenuOpen(false)} type="button"><Icon name="close" size={23} /></button>
        <div className="side-brand">Clochette / 2026</div>
        <nav className="side-links">
          <Link className="side-link" href="/" onClick={() => setMenuOpen(false)}>{t.backToStore}</Link>
          <Link className="side-link" href="/about" onClick={() => setMenuOpen(false)}>{t.about}</Link>
          <Link className="side-link" href="/why-clochette" onClick={() => setMenuOpen(false)}>{t.whyUs}</Link>
          <Link className="side-link" href="/contact" onClick={() => setMenuOpen(false)}>{t.contact}</Link>
        </nav>
        <div className="side-footer">
          <div className="mb-3 text-sm text-[#8a7b7d]">{t.follow}</div>
          <div className="social-row">
            <a aria-label="Instagram" href="https://www.instagram.com" rel="noreferrer" target="_blank"><Icon name="instagram" size={20} /></a>
            <a aria-label="TikTok" href="https://www.tiktok.com" rel="noreferrer" target="_blank"><Icon name="tiktok" size={20} /></a>
            <a aria-label="Facebook" href="https://www.facebook.com" rel="noreferrer" target="_blank"><Icon name="facebook" size={20} /></a>
          </div>
        </div>
      </aside>

      <div className={`side-overlay ${cartOpen ? "open" : ""}`} onClick={() => setCartOpen(false)} />
      <aside aria-label={t.cartTitle} className={`side-panel cart-panel ${cartOpen ? "open" : ""}`}>
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
                    <div className="text-sm font-bold text-[#617549] mt-1">{formatPrice(line.price * line.quantity, locale)}</div>
                  </div>
                  <button type="button" aria-label={t.remove} onClick={() => removeLine(line.key)} className="icon-button text-red-500 hover:text-red-700">
                    <Icon name="close" size={17} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-5 border-t border-[#e8e2dc]">
              <div className="flex justify-between items-center font-bold text-[#617549] mb-4">
                <span>{t.total}</span>
                <span>{formatPrice(cartTotal, locale)}</span>
              </div>
              <Link href="/cart" className="flex items-center justify-center gap-2 rounded-full bg-[#617549] text-[#fffaf8] px-6 py-3.5 text-sm font-bold transition-opacity hover:opacity-90">
                {t.checkout} <Icon name="arrow" size={16} />
              </Link>
            </div>
          </>
        )}
      </aside>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-[#e8e2dc] bg-[#e3dedc]">
              <img src={mainImage} alt={productData.name[locale]} className="object-cover w-full h-full" />
              {discount > 0 && (
                <span className="absolute top-4 right-4 bg-[#617549] text-[#fffaf8] px-4 py-1.5 text-sm font-bold rounded-full shadow-sm">
                  -{discount}%
                </span>
              )}
            </div>
            {hasThumbs && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                {productData.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`w-20 h-24 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${activeImage === index ? "border-[#617549]" : "border-transparent hover:border-[#cbbfb4]"}`}
                  >
                    <img src={image} alt="" className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold text-[#2a2522]">{productData.name[locale]}</h1>

            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <span className="text-2xl md:text-3xl font-bold text-[#617549]">{formatPrice(productData.price, locale)}</span>
              {discount > 0 && (
                <span className="text-lg text-[#857d76] line-through">{formatPrice(productData.oldPrice, locale)}</span>
              )}
            </div>

            <p className="text-[#5c544e] leading-relaxed mt-5">{productData.description[locale]}</p>

            {productData.colors.length > 1 && (
              <div className="mt-7">
                <div className="flex items-center justify-between text-sm font-medium text-[#2a2522] mb-3">
                  <span>{t.color}</span>
                  <span className="text-[#857d76]">{colorLabel}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productData.colors.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setSelectedColor(item.value)}
                      className={`px-4 py-2 rounded-full border text-sm transition-colors ${selectedColor === item.value ? "border-[#617549] bg-[#617549] text-[#fffaf8]" : "border-[#d8cfc6] bg-white text-[#2a2522] hover:border-[#617549]"}`}
                    >
                      {item[locale]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {productData.sizes.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm font-medium text-[#2a2522] mb-3">
                  <span>{t.size}</span>
                  <span className="text-[#857d76]">{t.choose}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productData.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${selectedSize === size ? "border-[#617549] bg-[#617549] text-[#fffaf8]" : "border-[#d8cfc6] bg-white text-[#2a2522] hover:border-[#617549]"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <div className="text-sm font-medium text-[#2a2522] mb-3">{t.quantity}</div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="inline-flex items-center rounded-full border border-[#d8cfc6] bg-white overflow-hidden">
                  <button type="button" className="px-4 py-2 text-lg text-[#617549] hover:bg-[#f3ece5]" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                  <span className="px-5 font-medium text-[#2a2522]">{quantity}</span>
                  <button type="button" className="px-4 py-2 text-lg text-[#617549] hover:bg-[#f3ece5]" onClick={() => setQuantity((q) => Math.min(10, q + 1))}>+</button>
                </div>
                <button type="button" onClick={addToCart} className={`inline-flex items-center gap-2 rounded-full border-2 px-6 py-2.5 text-sm font-bold transition-colors ${addedFlash ? "border-[#617549] bg-[#617549] text-[#fffaf8]" : "border-[#617549] text-[#617549] hover:bg-[#617549] hover:text-[#fffaf8]"}`}>
                  <Icon name="bag" size={17} /> {addedFlash ? t.added : t.addToCart}
                </button>
              </div>
            </div>

            <button type="button" onClick={orderNow} className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#617549] text-[#fffaf8] px-8 py-4 text-base font-bold transition-opacity hover:opacity-90">
              {t.orderNow} <Icon name="arrow" size={18} />
            </button>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((benefit) => (
                <li key={benefit.icon} className="flex items-center gap-3 rounded-2xl bg-[#E7D0D0]/45 border border-[#E7D0D0] px-4 py-3 text-sm text-[#2a2522]">
                  <span className="text-[#617549]"><Icon name={benefit.icon} size={19} /></span>
                  {benefit.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </main>

      <footer className="mt-10" style={{ backgroundColor: "#E7D0D0" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <div className="text-2xl font-bold text-[#2a2522]">Clochette</div>
              <p className="text-[#6e5b52] mt-2 max-w-sm">{t.footerText}</p>
            </div>
            <div>
              <div className="mb-3 text-sm text-[#6e5b52]">{t.follow}</div>
              <div className="flex gap-4 text-[#2a2522]">
                <a aria-label="Instagram" href="https://www.instagram.com" rel="noreferrer" target="_blank"><Icon name="instagram" size={20} /></a>
                <a aria-label="TikTok" href="https://www.tiktok.com" rel="noreferrer" target="_blank"><Icon name="tiktok" size={20} /></a>
                <a aria-label="Facebook" href="https://www.facebook.com" rel="noreferrer" target="_blank"><Icon name="facebook" size={20} /></a>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-2 mt-10 pt-6 border-t border-[#d9bcbc] text-sm text-[#6e5b52]">
            <span>{t.rights}</span>
            <span>Algeria · Made with care</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
