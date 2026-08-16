export type Locale = "ar" | "fr";

export type Wilaya = {
  code: string;
  ar: string;
  fr: string;
  communes: string[];
};

export const PRODUCT = {
  name: {
    ar: "طقم روزالي الناعم",
    fr: "Ensemble Rosalie",
  },
  subtitle: {
    ar: "أناقة هادئة لكل يوم",
    fr: "Une élégance douce au quotidien",
  },
  price: 4900,
  oldPrice: 6900,
  delivery: 600,
  currency: "دج",
  colors: [
    { ar: "وردي بودري", fr: "Rose poudré", value: "#d99aa6" },
    { ar: "أخضر مريمي", fr: "Vert sauge", value: "#aabda7" },
    { ar: "عاجي", fr: "Ivoire", value: "#eee6d7" },
  ],
  sizes: ["S", "M", "L", "XL"],
  images: [
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85",
  ],
  description: {
    ar: "طقم روزالي مصنوع من قماش ناعم بانسيابية جميلة، بقصة مريحة ولمسة أنثوية تليق بإطلالتك اليومية. قطعة سهلة التنسيق، خفيفة على الجسم ومختارة بعناية لتمنحك الراحة والأناقة معاً.",
    fr: "L’ensemble Rosalie est confectionné dans une matière douce au tombé fluide. Sa coupe confortable et sa touche féminine accompagnent vos journées avec légèreté, confort et élégance.",
  },
};

export const WILAYAS: Wilaya[] = [
  { code: "01", ar: "أدرار", fr: "Adrar", communes: ["أدرار", "تمنطيط", "رقان"] },
  { code: "02", ar: "الشلف", fr: "Chlef", communes: ["الشلف", "وادي الفضة", "بوقادير"] },
  { code: "03", ar: "الأغواط", fr: "Laghouat", communes: ["الأغواط", "آفلو", "قصر الحيران"] },
  { code: "04", ar: "أم البواقي", fr: "Oum El Bouaghi", communes: ["أم البواقي", "عين البيضاء", "عين مليلة"] },
  { code: "05", ar: "باتنة", fr: "Batna", communes: ["باتنة", "بريكة", "آريس"] },
  { code: "06", ar: "بجاية", fr: "Béjaïa", communes: ["بجاية", "أميزور", "أقبو"] },
  { code: "07", ar: "بسكرة", fr: "Biskra", communes: ["بسكرة", "طولقة", "سيدي عقبة"] },
  { code: "08", ar: "بشار", fr: "Béchar", communes: ["بشار", "القنادسة", "تاغيت"] },
  { code: "09", ar: "البليدة", fr: "Blida", communes: ["البليدة", "بوعينان", "بوفاريك"] },
  { code: "10", ar: "البويرة", fr: "Bouira", communes: ["البويرة", "الأخضرية", "سور الغزلان"] },
  { code: "11", ar: "تمنراست", fr: "Tamanrasset", communes: ["تمنراست", "عين أمقل", "إدلس"] },
  { code: "12", ar: "تبسة", fr: "Tébessa", communes: ["تبسة", "الشريعة", "بئر العاتر"] },
  { code: "13", ar: "تلمسان", fr: "Tlemcen", communes: ["تلمسان", "منصورة", "مغنية"] },
  { code: "14", ar: "تيارت", fr: "Tiaret", communes: ["تيارت", "فرندة", "السوقر"] },
  { code: "15", ar: "تيزي وزو", fr: "Tizi Ouzou", communes: ["تيزي وزو", "ذراع بن خدة", "الأربعاء ناث إيراثن"] },
  { code: "16", ar: "الجزائر", fr: "Alger", communes: ["الجزائر الوسطى", "حسين داي", "الدار البيضاء"] },
  { code: "17", ar: "الجلفة", fr: "Djelfa", communes: ["الجلفة", "حاسي بحبح", "عين وسارة"] },
  { code: "18", ar: "جيجل", fr: "Jijel", communes: ["جيجل", "الطاهير", "العوانة"] },
  { code: "19", ar: "سطيف", fr: "Sétif", communes: ["سطيف", "العلمة", "عين أرنات"] },
  { code: "20", ar: "سعيدة", fr: "Saïda", communes: ["سعيدة", "عين الحجر", "الحساسنة"] },
  { code: "21", ar: "سكيكدة", fr: "Skikda", communes: ["سكيكدة", "عزابة", "القل"] },
  { code: "22", ar: "سيدي بلعباس", fr: "Sidi Bel Abbès", communes: ["سيدي بلعباس", "تلموني", "تلاغ"] },
  { code: "23", ar: "عنابة", fr: "Annaba", communes: ["عنابة", "البوني", "برحال"] },
  { code: "24", ar: "قالمة", fr: "Guelma", communes: ["قالمة", "وادي الزناتي", "هيليوبوليس"] },
  { code: "25", ar: "قسنطينة", fr: "Constantine", communes: ["قسنطينة", "الخروب", "حامة بوزيان"] },
  { code: "26", ar: "المدية", fr: "Médéa", communes: ["المدية", "قصر البخاري", "البرواقية"] },
  { code: "27", ar: "مستغانم", fr: "Mostaganem", communes: ["مستغانم", "مزغران", "عين تادلس"] },
  { code: "28", ar: "المسيلة", fr: "M'Sila", communes: ["المسيلة", "بوسعادة", "سيدي عيسى"] },
  { code: "29", ar: "معسكر", fr: "Mascara", communes: ["معسكر", "غريس", "سيق"] },
  { code: "30", ar: "ورقلة", fr: "Ouargla", communes: ["ورقلة", "حاسي مسعود", "تقرت"] },
  { code: "31", ar: "وهران", fr: "Oran", communes: ["وهران", "بئر الجير", "السانية"] },
  { code: "32", ar: "البيض", fr: "El Bayadh", communes: ["البيض", "بوقطب", "بريزينة"] },
  { code: "33", ar: "إليزي", fr: "Illizi", communes: ["إليزي", "إن أميناس", "برج عمر إدريس"] },
  { code: "34", ar: "برج بوعريريج", fr: "Bordj Bou Arréridj", communes: ["برج بوعريريج", "رأس الوادي", "المنصورة"] },
  { code: "35", ar: "بومرداس", fr: "Boumerdès", communes: ["بومرداس", "الرويبة", "برج منايل"] },
  { code: "36", ar: "الطارف", fr: "El Tarf", communes: ["الطارف", "القالة", "الذرعان"] },
  { code: "37", ar: "تندوف", fr: "Tindouf", communes: ["تندوف", "أم العسل"] },
  { code: "38", ar: "تيسمسيلت", fr: "Tissemsilt", communes: ["تيسمسيلت", "ثنية الحد", "برج بونعامة"] },
  { code: "39", ar: "الوادي", fr: "El Oued", communes: ["الوادي", "قمار", "الرباح"] },
  { code: "40", ar: "خنشلة", fr: "Khenchela", communes: ["خنشلة", "قايس", "ششار"] },
  { code: "41", ar: "سوق أهراس", fr: "Souk Ahras", communes: ["سوق أهراس", "سدراتة", "مداوروش"] },
  { code: "42", ar: "تيبازة", fr: "Tipaza", communes: ["تيبازة", "القليعة", "حجوط"] },
  { code: "43", ar: "ميلة", fr: "Mila", communes: ["ميلة", "فرجيوة", "شلغوم العيد"] },
  { code: "44", ar: "عين الدفلى", fr: "Aïn Defla", communes: ["عين الدفلى", "خميس مليانة", "العطاف"] },
  { code: "45", ar: "النعامة", fr: "Naâma", communes: ["النعامة", "المشرية", "عين الصفراء"] },
  { code: "46", ar: "عين تموشنت", fr: "Aïn Témouchent", communes: ["عين تموشنت", "المالح", "حمام بوحجر"] },
  { code: "47", ar: "غرداية", fr: "Ghardaïa", communes: ["غرداية", "بونورة", "القرارة"] },
  { code: "48", ar: "غليزان", fr: "Relizane", communes: ["غليزان", "وادي رهيو", "عمي موسى"] },
  { code: "49", ar: "تيميمون", fr: "Timimoun", communes: ["تيميمون", "أوقروت", "طلمين"] },
  { code: "50", ar: "برج باجي مختار", fr: "Bordj Badji Mokhtar", communes: ["برج باجي مختار", "تيمياوين"] },
  { code: "51", ar: "أولاد جلال", fr: "Ouled Djellal", communes: ["أولاد جلال", "رأس الميعاد", "البسباس"] },
  { code: "52", ar: "بني عباس", fr: "Béni Abbès", communes: ["بني عباس", "الواتة", "إقلي"] },
  { code: "53", ar: "عين صالح", fr: "In Salah", communes: ["عين صالح", "فقارة الزوى", "الحيران"] },
  { code: "54", ar: "عين قزام", fr: "In Guezzam", communes: ["عين قزام", "تين زواتين"] },
  { code: "55", ar: "تقرت", fr: "Touggourt", communes: ["تقرت", "النزلة", "الزاوية العابدية"] },
  { code: "56", ar: "جانت", fr: "Djanet", communes: ["جانت", "برج الحواس"] },
  { code: "57", ar: "المغير", fr: "El M'Ghair", communes: ["المغير", "جامعة", "سيدي خليل"] },
  { code: "58", ar: "المنيعة", fr: "El Meniaa", communes: ["المنيعة", "حاسي القارة", "حاسي الفحل"] },
];

export const formatPrice = (amount: number, locale: Locale = "ar") =>
  `${new Intl.NumberFormat(locale === "ar" ? "ar-DZ" : "fr-FR").format(amount)} ${locale === "ar" ? "دج" : "DA"}`;
