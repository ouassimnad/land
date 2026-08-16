"use client";

import { FormEvent, ReactNode, useState } from "react";
import { PRODUCT as STATIC_PRODUCT, type Locale, WILAYAS, formatPrice } from "@/lib/catalog";

type IconName =
  | "menu"
  | "close"
  | "arrow"
  | "chevron"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "truck"
  | "shield"
  | "gift"
  | "check"
  | "star"
  | "sparkle";

type FormState = {
  customerName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
};

type Copy = {
  announcement: string[];
  menu: string;
  collection: string;
  order: string;
  reviews: string;
  follow: string;
  language: string;
  newDrop: string;
  productLabel: string;
  delivery: string;
  color: string;
  size: string;
  choose: string;
  orderNow: string;
  details: string;
  orderKicker: string;
  orderTitle: string;
  orderDescription: string;
  orderFormTitle: string;
  fullName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  addressPlaceholder: string;
  quantity: string;
  quantityHint: string;
  summary: string;
  item: string;
  shipping: string;
  total: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
  secure: string;
  deliveryTime: string;
  return: string;
  benefitItems: string[];
  reviewKicker: string;
  reviewTitle: string;
  reviewNote: string;
  footerText: string;
  rights: string;
  allWilayas: string;
  select: string;
};

const COPY: Record<Locale, Copy> = {
  ar: {
    announcement: ["التوصيل متوفر إلى 58 ولاية", "الدفع عند الاستلام", "جودة ونوعية تميزنا"],
    menu: "القائمة",
    collection: "المجموعة",
    order: "اطلبي الآن",
    reviews: "آراء عميلاتنا",
    follow: "تابعينا على",
    language: "اللغة",
    newDrop: "إصدار جديد · ربيع 2026",
    productLabel: "القطعة الأكثر طلباً",
    delivery:"",
    color: "اللون",
    size: "المقاس",
    choose: "اختاري",
    orderNow: "اطلبي قطعتك",
    details: "اكتشفي التفاصيل",
    orderKicker: "خطوتك الأولى نحو الأناقة",
    orderTitle: "اجعليها لكِ",
    orderDescription: "املئي معلوماتك وسنتواصل معكِ هاتفياً لتأكيد الطلب قبل الشحن. بسيطة، آمنة، وبدون دفع مسبق.",
    orderFormTitle: "معلومات التوصيل",
    fullName: "الاسم الكامل",
    phone: "رقم الهاتف",
    wilaya: "الولاية",
    commune: "البلدية",
    address: "العنوان التفصيلي",
    addressPlaceholder: "الحي، رقم المنزل، معلم قريب...",
    quantity: "الكمية",
    quantityHint: "قطعة",
    summary: "ملخص الطلب",
    item: "سعر المنتج",
    shipping: "التوصيل",
    total: "المجموع",
    submit: "تأكيد الطلب",
    submitting: "جارٍ الإرسال...",
    success: "تم استلام طلبكِ! سنتصل بكِ قريباً للتأكيد.",
    error: "تعذر إرسال الطلب حالياً، يرجى المحاولة من جديد.",
    secure: "طلبكِ آمن ومؤكد هاتفياً",
    deliveryTime: "التوصيل خلال 24–72 ساعة",
    return: "استبدال سهل خلال 7 أيام",
    benefitItems: ["دفع عند الاستلام", "توصيل إلى 58 ولاية", "تغليف أنيق ومميز", "اختياركِ دائماً على ذوقكِ"],
    reviewKicker: "محبة من أول ارتداء",
    reviewTitle: "قالوا عن Clochette",
    reviewNote: "أكثر من 2,000 عميلة سعيدة",
    footerText: "قطع تشبهكِ، وتفاصيل تبقى معكِ.",
    rights: "© 2026 Clochette. كل الحقوق محفوظة.",
    allWilayas: "اختاري الولاية",
    select: "اختاري",
  },
  fr: {
    announcement: ["Livraison dans les 58 wilayas", "Paiement à la livraison", "Une qualité qui nous distingue"],
    menu: "Menu",
    collection: "Collection",
    order: "Commander",
    reviews: "Avis clientes",
    follow: "Suivez-nous",
    language: "Langue",
    newDrop: "Nouveau drop · Printemps 2026",
    productLabel: "La pièce préférée",
    delivery: "Livraison rapide dans toute l’Algérie · 600 DA",
    color: "Couleur",
    size: "Taille",
    choose: "Choisir",
    orderNow: "Commander ma pièce",
    details: "Découvrir les détails",
    orderKicker: "Votre première étape vers l’élégance",
    orderTitle: "Elle est à vous",
    orderDescription: "Remplissez vos informations. Nous vous appellerons pour confirmer la commande avant l’expédition. Simple, sûr, sans paiement anticipé.",
    orderFormTitle: "Informations de livraison",
    fullName: "Nom complet",
    phone: "Numéro de téléphone",
    wilaya: "Wilaya",
    commune: "Commune",
    address: "Adresse détaillée",
    addressPlaceholder: "Quartier, numéro, repère proche...",
    quantity: "Quantité",
    quantityHint: "pièce(s)",
    summary: "Résumé de la commande",
    item: "Prix du produit",
    shipping: "Livraison",
    total: "Total",
    submit: "Confirmer la commande",
    submitting: "Envoi en cours...",
    success: "Votre commande est bien reçue ! Nous vous appellerons bientôt.",
    error: "La commande n’a pas pu être envoyée. Réessayez, s’il vous plaît.",
    secure: "Commande sécurisée, confirmée par téléphone",
    deliveryTime: "Livraison sous 24–72 heures",
    return: "Échange facile sous 7 jours",
    benefitItems: ["Paiement à la livraison", "Livraison dans 58 wilayas", "Emballage soigné", "Votre style, votre choix"],
    reviewKicker: "Adorée dès le premier porté",
    reviewTitle: "Elles parlent de Clochette",
    reviewNote: "Plus de 2 000 clientes heureuses",
    footerText: "Des pièces qui vous ressemblent, des détails qui restent.",
    rights: "© 2026 Clochette. Tous droits réservés.",
    allWilayas: "Choisir une wilaya",
    select: "Choisir",
  },
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  let content: ReactNode;
  switch (name) {
    case "menu":
      content = <><path d="M3 6h18M3 12h13M3 18h18" /></>;
      break;
    case "close":
      content = <><path d="m5 5 14 14M19 5 5 19" /></>;
      break;
    case "arrow":
      content = <><path d="M5 12h14M13 6l6 6-6 6" /></>;
      break;
    case "chevron":
      content = <><path d="m6 9 6 6 6-6" /></>;
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
    case "truck":
      content = <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>;
      break;
    case "shield":
      content = <><path d="M12 3 20 6v5c0 5-3.3 8.4-8 10-4.7-1.6-8-5-8-10V6l8-3Z" /><path d="m8.5 12 2.2 2.2 4.8-4.8" /></>;
      break;
    case "gift":
      content = <><path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7H8.5a2 2 0 1 1 2-2c1.5 0 1.5 2 1.5 2ZM12 7h3.5a2 2 0 1 0-2-2c-1.5 0-1.5 2-1.5 2Z" /></>;
      break;
    case "check":
      content = <><path d="m5 12 4 4L19 6" /></>;
      break;
    case "star":
      content = <><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9L12 3Z" fill="currentColor" stroke="none" /></>;
      break;
    case "sparkle":
      content = <><path d="m12 2 1.3 6.7L20 10l-6.7 1.3L12 18l-1.3-6.7L4 10l6.7-1.3L12 2ZM19 16l.6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z" fill="currentColor" stroke="none" /></>;
      break;
  }
  return <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">{content}</svg>;
}

const reviewData = [
  { name: "سارة ب.", city: "الجزائر العاصمة", text: "الطقم أجمل من الصور! القماش ناعم والمقاس جاء مضبوطاً تماماً. شكراً Clochette على الذوق.", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80" },
  { name: "ريم ك.", city: "وهران", text: "وصلني في يومين فقط والتغليف يفتح النفس. أحببت اللون المريمي كثيراً وسأطلب مرة أخرى.", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=160&q=80" },
  { name: "ليلى م.", city: "قسنطينة", text: "تجربة رائعة من الطلب إلى الاستلام. خدمة محترمة وقطعة راقية، أنصح بها لكل البنات.", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" },
];

export default function Storefront({ productData = STATIC_PRODUCT }: { productData?: typeof STATIC_PRODUCT }) {
  const [locale, setLocale] = useState<Locale>("ar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(productData.colors[0].value);
  const [selectedSize, setSelectedSize] = useState(productData.sizes[1]);
  const [quantity, setQuantity] = useState(1);
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState<FormState>({
    customerName: "",
    phone: "",
    wilaya: "16",
    commune: WILAYAS.find((item) => item.code === "16")?.communes[0] ?? "الجزائر الوسطى",
    address: "",
  });
  const t = COPY[locale];
  const selectedWilaya = WILAYAS.find((item) => item.code === form.wilaya) ?? WILAYAS[0];
  const color = productData.colors.find((item) => item.value === selectedColor) ?? productData.colors[0];
  const total = productData.price * quantity + productData.delivery;
  const discount = Math.round((1 - productData.price / productData.oldPrice) * 100);

  const updateForm = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("loading");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, quantity, color: color.ar, size: selectedSize }),
      });
      if (!response.ok) throw new Error("order_failed");
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  };

  const switchLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    document.documentElement.lang = nextLocale;
  };

  return (
    <div className="page-noise min-h-screen" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="announcement-shell">
        <div className="announcement-track">
          {[...t.announcement, ...t.announcement].map((item, index) => <span className="announcement-item" key={`${item}-${index}`}>{item}</span>)}
        </div>
      </div>

      <header className="header-wrap">
        <div className="header-inner">
          <button aria-label={t.menu} className="menu-button" onClick={() => setMenuOpen(true)} type="button">
            <Icon name="menu" size={21} /> <span>{t.menu}</span>
          </button>
          <a className="logo-lockup" href="#top" aria-label="Clochette">
            <img alt="Clochette logo" src="/logo.png" />
            <span className="logo-word">Clochette</span>
          </a>
          <div className="header-action">
            <a href="#reviews">{t.reviews}</a>
            <span aria-hidden="true">·</span>
            <a href="#order">{t.order}</a>
          </div>
        </div>
      </header>

      <div className={`side-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <aside aria-label={t.menu} className={`side-panel ${menuOpen ? "open" : ""}`}>
        <button aria-label={t.menu} className="side-close" onClick={() => setMenuOpen(false)} type="button"><Icon name="close" size={23} /></button>
        <div className="side-brand">Clochette / 2026</div>
        <nav className="side-links">
          <a className="side-link" href="#product" onClick={() => setMenuOpen(false)}>{t.collection}</a>
          <a className="side-link" href="#order" onClick={() => setMenuOpen(false)}>{t.order}</a>
          <a className="side-link" href="#reviews" onClick={() => setMenuOpen(false)}>{t.reviews}</a>
        </nav>
        <div className="side-footer">
          <div className="mb-3 text-sm text-[#8a7b7d]">{t.follow}</div>
          <div className="social-row">
            <a aria-label="Instagram" href="https://www.instagram.com" rel="noreferrer" target="_blank"><Icon name="instagram" size={20} /></a>
            <a aria-label="TikTok" href="https://www.tiktok.com" rel="noreferrer" target="_blank"><Icon name="tiktok" size={20} /></a>
            <a aria-label="Facebook" href="https://www.facebook.com" rel="noreferrer" target="_blank"><Icon name="facebook" size={20} /></a>
          </div>
          <div className="mt-5 text-sm text-[#8a7b7d]">{t.language}</div>
          <div className="lang-switcher">
            <button className={locale === "ar" ? "active" : ""} onClick={() => switchLocale("ar")} type="button">العربية</button>
            <button className={locale === "fr" ? "active" : ""} onClick={() => switchLocale("fr")} type="button">Français</button>
          </div>
        </div>
      </aside>

      <main id="top">
        <section className="hero-section" id="product">
          <div className="hero-grid">
            <div className="hero-copy">
              <h1 className="hero-title">{productData.name[locale]}</h1>
              <div className="price-row">
                <span className="price-now">{formatPrice(productData.price, locale)}</span>
                <span className="price-old">{formatPrice(productData.oldPrice, locale)}</span>
                <span className="discount-pill">-{discount}%</span>
              </div>
              <p className="delivery-note">{t.delivery}</p>

              <div className="option-block">
                <div className="option-label"><span>{t.color}</span><span>{color[locale]}</span></div>
                <div className="color-options">
                  {productData.colors.map((item, index) => <button aria-label={item[locale]} className={`color-button ${selectedColor === item.value ? "selected" : ""}`} key={item.value} onClick={() => { setSelectedColor(item.value); setActiveImage(index); }} type="button"><span className="color-dot" style={{ background: item.value }} />{item[locale]}</button>)}
                </div>
              </div>
              <div className="option-block">
                <div className="option-label"><span>{t.size}</span><span>{t.choose}</span></div>
                <div className="size-options">
                  {productData.sizes.map((size) => <button className={`size-button ${selectedSize === size ? "selected" : ""}`} key={size} onClick={() => setSelectedSize(size)} type="button">{size}</button>)}
                </div>
              </div>

            </div>

            <div className="hero-gallery">
              <div className="gallery-layout">
                <div className="gallery-main">
                  <img alt={productData.name[locale]} src={color.image ?? productData.images[activeImage]} />
                  <span className="gallery-badge">Clochette / EDITION 01</span>
                  <span className="gallery-count">0{activeImage + 1} / 0{productData.images.length}</span>
                </div>
                <div className="thumbs">
                  {productData.colors.map((item, index) => <button aria-label={`${item[locale]}`} className={`thumb ${activeImage === index ? "active" : ""}`} key={item.value} onClick={() => { setActiveImage(index); setSelectedColor(item.value); }} type="button"><img alt="" src={item.image} /></button>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="order-section" id="order">
          <div className="order-shell">


            <form className="order-card" onSubmit={submitOrder}>
              <h3 className="form-heading">{t.orderFormTitle}</h3>
              <div className="form-grid">
                <div className="field"><label htmlFor="customerName">{t.fullName}</label><input id="customerName" required value={form.customerName} onChange={(event) => updateForm("customerName", event.target.value)} placeholder={t.fullName} /></div>
                <div className="field"><label htmlFor="phone">{t.phone}</label><input id="phone" required type="tel" value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} placeholder="05 / 06 / 07 xx xx xx xx" /></div>
                <div className="field"><label htmlFor="wilaya">{t.wilaya}</label><select id="wilaya" required value={form.wilaya} onChange={(event) => { const next = WILAYAS.find((item) => item.code === event.target.value) ?? WILAYAS[0]; setForm((current) => ({ ...current, wilaya: next.code, commune: next.communes[0] })); }}><option value="">{t.allWilayas}</option>{WILAYAS.map((item) => <option key={item.code} value={item.code}>{item.code} — {item[locale]}</option>)}</select></div>
                <div className="field"><label htmlFor="commune">{t.commune}</label><select id="commune" required value={form.commune} onChange={(event) => updateForm("commune", event.target.value)}>{selectedWilaya.communes.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
                <div className="field full"><label htmlFor="address">{t.address}</label><textarea id="address" required value={form.address} onChange={(event) => updateForm("address", event.target.value)} placeholder={t.addressPlaceholder} /></div>
                <div className="field"><label htmlFor="quantity">{t.quantity}</label><input id="quantity" min="1" max="10" required type="number" value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(10, Number(event.target.value) || 1)))} /></div>
              </div>
              <div className="summary-box">
                <div className="summary-title">{t.summary}</div>
                <div className="summary-line"><span>{productData.name[locale]} × {quantity}</span><span>{formatPrice(productData.price * quantity, locale)}</span></div>
                <div className="summary-line"><span>{t.color} · {color[locale]} / {t.size} · {selectedSize}</span><span /></div>
                <div className="summary-line"><span>{t.shipping}</span><span>{formatPrice(productData.delivery, locale)}</span></div>
                <div className="summary-line total"><span>{t.total}</span><span>{formatPrice(total, locale)}</span></div>
              </div>
              <div className="submit-row">
                <button className="primary-button submit-button" disabled={submitState === "loading"} type="submit">{submitState === "loading" ? t.submitting : t.submit} <Icon name="arrow" size={17} /></button>
              </div>
              {submitState === "success" && <p className="form-message">{t.success}</p>}
              {submitState === "error" && <p className="form-message error">{t.error}</p>}
            </form>
          </div>
        </section>



        <section className="reviews-section" id="reviews">
          <div className="reviews-heading">
            <div><div className="section-kicker">{t.reviewKicker}</div><h2 className="section-title">{t.reviewTitle}</h2></div>
            <div className="review-note">{t.reviewNote}</div>
          </div>
          <div className="reviews-grid">
            {reviewData.map((review) => <article className="review-card" key={review.name}><div className="review-top"><img alt={review.name} className="review-avatar" src={review.image} /><div><div className="review-name">{review.name}</div><div className="review-city">{review.city}</div></div><div aria-label="5 stars" className="stars">★★★★★</div></div><p className="review-text">“{review.text}”</p></article>)}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top"><div><div className="footer-brand">Clochette</div><p className="footer-copy">{t.footerText}</p></div><div><div className="mb-3 text-sm text-[#ad9e9f]">{t.follow}</div><div className="footer-social"><a aria-label="Instagram" href="https://www.instagram.com" rel="noreferrer" target="_blank"><Icon name="instagram" size={19} /></a><a aria-label="TikTok" href="https://www.tiktok.com" rel="noreferrer" target="_blank"><Icon name="tiktok" size={19} /></a><a aria-label="Facebook" href="https://www.facebook.com" rel="noreferrer" target="_blank"><Icon name="facebook" size={19} /></a></div></div></div>
        <div className="footer-bottom"><span>{t.rights}</span><span>Algeria · Made with care</span></div>
      </footer>
    </div>
  );
}
