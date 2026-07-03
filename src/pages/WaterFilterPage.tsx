import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, CheckCircle, MessageCircle, Wallet, Truck,
  ShieldCheck, ChevronDown, ArrowLeft, Star, Sparkles,
  ShoppingCart, Droplets, Wrench, Info, HelpCircle
} from "lucide-react";
import OrderFormModal from "../components/OrderFormModal";
import { useCart } from "../store/cart";

// ─── Product images (WebP next-gen + PNG fallback) ───
const IMG_HERO      = "/images/water-filter/hero.webp";
const IMG_HERO_SM   = "/images/water-filter/hero-sm.webp";
const IMG_HERO_PNG  = "/images/water-filter/hero.png";

const IMG_SOLUTION      = "/images/water-filter/solution.webp";
const IMG_SOLUTION_SM   = "/images/water-filter/solution-sm.webp";
const IMG_SOLUTION_PNG  = "/images/water-filter/solution.png";

const IMG_MECHANISM     = "/images/water-filter/mechanism.webp";
const IMG_MECHANISM_SM  = "/images/water-filter/mechanism-sm.webp";
const IMG_MECHANISM_PNG = "/images/water-filter/mechanism.png";

const IMG_PACKAGE       = "/images/water-filter/package.webp";
const IMG_PACKAGE_SM    = "/images/water-filter/package-sm.webp";
const IMG_PACKAGE_PNG   = "/images/water-filter/package.png";

// Hero gallery — each entry: [webp, webp-small, png-fallback]
const IMGS: [string, string, string][] = [
  [IMG_HERO, IMG_HERO_SM, IMG_HERO_PNG],
  [IMG_SOLUTION, IMG_SOLUTION_SM, IMG_SOLUTION_PNG],
  [IMG_MECHANISM, IMG_MECHANISM_SM, IMG_MECHANISM_PNG],
  [IMG_PACKAGE, IMG_PACKAGE_SM, IMG_PACKAGE_PNG],
];

// ─── WhatsApp for this product page only ───
const WA_PHONE = "212617470221";
const WA_LINK = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent("سلام، بغيت نستافسر على فلتر ماء الصنبور الذكي 💧")}`;

const PROMO = [
  { text: "الدفع عند الاستلام", accent: false },
  { text: "توصيل سريع بالمجان", accent: false },
  { text: "ضمان التوافق التام 100%", accent: true },
  { text: "تأكيد الطلب قبل الشحن", accent: false },
  { text: "مراجعة المنتج عند التسليم", accent: false },
  { text: "⚡ الكمية المتوفرة محدودة", accent: true },
];

const FAQS = [
  {
    q: "واش هاد الفلتر كينقي الماء 100% وكيردو طبي؟",
    a: "لا، حنا ما كنبيعوش وعود مبالغ فيها. هاد الفلتر مصمم لماء الروبيني الصالح للشرب باش يحسن المذاق، يحيد ريحة الكلور، ويلتقط بعض الشوائب."
  },
  {
    q: "واش غادي يركب فالصنبور ديالي؟",
    a: "كيركب فمعظم الصنابير العادية. قبل ما تطلب، غتلقى صور التوافق باش تتأكد، وإلا كان عندك صنبور pull-out تواصل معانا."
  },
  {
    q: "شحال كتدوم الكارتوشة؟",
    a: "على حسب الاستعمال، ولكن غالباً خاصها تتبدل كل بضعة أشهر باش تحافظ على نفس جودة المذاق ونقاء الماء."
  },
  {
    q: "واش غنلقى الكارتوشات (Refills) من بعد؟",
    a: "أكيد! حنا كنوفروليك الكارتوشات ديما، وكنفرو عرض باش تاخد كارتوشة إضافية من دابا وترتاح."
  },
  {
    q: "واش نقدر نركبو بوحدي؟",
    a: "إيه، ما محتاجش بلومبي. معاه Guide واضح وفيديو كيشرح التركيب خطوة بخطوة."
  }
];

const OFFERS = [
  {
    id: "basic",
    title: "باقة البداية (فلتر + 1 كارتوشة)",
    description: "فلتر واحد + 1 كارتوشة + Adapters التركيب",
    price: 159,
    originalPrice: 299,
    popular: false,
    savings: 140,
    badge: "الأساسي"
  },
  {
    id: "target",
    title: "باقة التوفير (فلتر + 2 كارتوشات)",
    description: "فلتر واحد + 2 كارتوشات (راحة لمدة أطول) + Adapters + تخفيض حصري",
    price: 199,
    originalPrice: 399,
    popular: true,
    savings: 200,
    badge: "الأكثر مبيعاً"
  },
  {
    id: "family",
    title: "الباقة العائلية (فلتر + 3 كارتوشات)",
    description: "فلتر واحد + 3 كارتوشات + Adapters + توصيل سريع جداً",
    price: 249,
    originalPrice: 499,
    popular: false,
    savings: 250,
    badge: "العائلية"
  }
];

const vp = { once: true, margin: "-60px" as const };

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const promoItems = [...PROMO, ...PROMO, ...PROMO];

export default function WaterFilterPage() {
  const [activeImg, setActiveImg] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(OFFERS[0]);
  const { addItem, openCart } = useCart();

  // Preload the LCP hero image as early as possible
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.type = "image/webp";
    link.href = IMG_HERO;
    link.setAttribute("fetchpriority", "high");
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  function addToCartDirect(offer: typeof OFFERS[0]) {
    addItem({
      id: `p-wf1-${offer.id}`,
      slug: "tap-water-filter",
      title: `فلتر ماء الصنبور - ${offer.badge}`,
      price: offer.price,
      image: IMG_HERO,
    });
    openCart();
  }

  function handleOrderClick(offer: typeof OFFERS[0]) {
    setSelectedOffer(offer);
    setShowForm(true);
  }

  return (
    <div className="pb-24 md:pb-0">

      {/* ══════════════════════════════════════════
          ANNOUNCEMENT BAR
      ══════════════════════════════════════════ */}
      <div className="overflow-hidden border-b border-line bg-white py-2.5">
        <div className="flex w-full">
          <div className="marquee-track flex shrink-0 items-center gap-10 pr-10">
            {promoItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 whitespace-nowrap">
                <span className="h-1 w-1 rounded-full bg-ink/15 shrink-0" />
                <span className={`text-[11px] font-semibold tracking-wide ${item.accent ? "text-brand" : "text-ink/60"}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-bg pt-8 pb-20 md:pb-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-20 h-[500px] w-[500px] rounded-full bg-brand/5 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-ink/5 blur-3xl" />
        </div>

        <div className="container-x relative z-10">
          <Link
            to="/products"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-ink/40 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            رجوع للمنتجات
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

            {/* ── Gallery ── */}
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative group">
                <div className="aspect-square overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={`${IMGS[activeImg][1]} 400w, ${IMGS[activeImg][0]} 800w`}
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 550px"
                    />
                    <img
                      src={IMGS[activeImg][2]}
                      alt="فلتر ماء الصنبور الذكي"
                      width={800}
                      height={800}
                      fetchPriority={activeImg === 0 ? "high" : "auto"}
                      loading={activeImg === 0 ? "eager" : "lazy"}
                      decoding={activeImg === 0 ? "sync" : "async"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </picture>
                </div>
                <div className="absolute -right-3 -top-3 rounded-full bg-brand px-3 py-1.5 text-[11px] font-bold text-white shadow-lift">
                  Level 7 Purification
                </div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {IMGS.map((imgSet, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square overflow-hidden rounded-xl border transition-all duration-200 ${
                      activeImg === i ? "border-brand ring-2 ring-brand/10 shadow-sm" : "border-line hover:border-brand/30"
                    }`}
                  >
                    <img src={imgSet[1]} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* ── Copy ── */}
            <motion.div
              className="order-2 lg:order-1"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div variants={fadeUp}>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink shadow-soft">
                  <Sparkles className="h-3 w-3 text-brand" />
                  ضمان التوافق التام
                </div>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-sans font-extrabold text-[32px] leading-[1.1] tracking-[-0.03em] text-brand sm:text-4xl lg:text-[44px]"
                dir="rtl"
              >
                خلي ماء الروبيني يولي أحسن فالمذاق والريحة
                <br />
                <span className="text-ink/80 text-[26px] sm:text-[32px] font-bold">بلا بلومبي وبلا صناع القراعي</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-4 max-w-md text-base leading-relaxed text-body sm:text-lg" dir="rtl">
                فلتر عملي كيركب فدقائق بلا حفير وكينقص ريحة الكلور والشوائب باش تستمتع بماء نقي وصافي مباشرة من الصنبور.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-6 flex items-baseline gap-3" dir="rtl">
                <span className="text-xs text-body font-semibold">يبدأ من</span>
                <span className="font-sans font-bold text-5xl text-ink">159</span>
                <span className="text-base text-body">درهم</span>
                <span className="text-sm line-through text-body/50">299 درهم</span>
                <span className="pill-red text-xs">عرض محدود</span>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6 flex flex-col gap-2" dir="rtl">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleOrderClick(OFFERS[0])}
                    className="btn-primary group flex-1 justify-center py-4 text-base"
                  >
                    <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                    اطلب الفلتر ديالك دابا
                  </button>
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="h-6 w-6" fill="white" strokeWidth={0} />
                  </a>
                </div>
              </motion.div>

              <motion.p variants={fadeUp} className="mt-3 text-center text-xs text-body/50" dir="rtl">
                الدفع عند الاستلام | التوصيل بالمجان | ضمان التوافق
              </motion.p>

              <motion.ul variants={stagger} className="mt-6 grid grid-cols-2 gap-2">
                {[
                  { icon: "⚡", text: "تركيب بلا حفير" },
                  { icon: "💧", text: "يصفي الكلور" },
                  { icon: "🥛", text: "مذاق طبيعي نقي" },
                  { icon: "📦", text: "توصيل مجاني" },
                ].map((b) => (
                  <motion.li
                    key={b.text}
                    variants={cardReveal}
                    className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink shadow-soft"
                  >
                    <span className="text-base">{b.icon}</span>
                    <span className="font-medium" dir="rtl">{b.text}</span>
                  </motion.li>
                ))}
              </motion.ul>

            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. THE HOOK & PROBLEM (PAS)
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-ink py-20 md:py-28">
        <div className="noise pointer-events-none absolute inset-0 opacity-[0.025]" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/8 blur-3xl" />

        <div className="container-x relative z-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/50">
              💧 تجربة يومية متعبة
            </div>
            <h2 className="font-sans font-extrabold text-3xl leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl md:text-5xl" dir="rtl">
              عييتي من نفس الصداع كل نهار مع الماء؟
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/60" dir="rtl">
              ماشي المشكل أنك باغي تبدل الماء كامل، المشكل أن التجربة اليومية ديالو ما مريحاكش ومكلفة ليك جهد ووقت.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { emoji: "😷", text: "طعم الكلور والريحة كيخليوك ما تبغيش تشرب من الروبيني مباشرة" },
              { emoji: "☕", text: "أتاي والقهوة ما كيخرجوش بالمذاق اللي بغيتي بسبب جودة الماء" },
              { emoji: "🏋️", text: "حمل القراعي التقال كل سيمانة ولا عبء عليك وعلى ظهرك" },
              { emoji: "🗑️", text: "القراعي كياخدو لك البلاصة فالكوزينة وكيديرو الروينة" },
              { emoji: "💸", text: "خايف تشري نظام فلترة كبير يتقام عليك غالي ويحتاج تهرس الكوزينة" },
            ].map(({ emoji, text }, i) => (
              <motion.div
                key={i} variants={cardReveal}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="flex cursor-default items-start gap-4 rounded-2xl border border-white/8 bg-white/5 p-5 transition-colors hover:border-white/15 hover:bg-white/8"
              >
                <span className="shrink-0 text-2xl">{emoji}</span>
                <p className="text-sm leading-relaxed text-white/70" dir="rtl">{text}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp}
            className="mt-10 text-center text-sm italic text-white/40"
            dir="rtl"
          >
            هاد الاحتكاك اليومي هو اللي كيخليك ما مرتاحش فدارك.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. THE SOLUTION
      ══════════════════════════════════════════ */}
      <section className="bg-bg py-20 md:py-28">
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={vp}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              <div className="aspect-square overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
                <picture>
                  <source
                    type="image/webp"
                    srcSet={`${IMG_SOLUTION_SM} 400w, ${IMG_SOLUTION} 800w`}
                    sizes="(max-width: 640px) 90vw, 550px"
                  />
                  <img
                    src={IMG_SOLUTION_PNG}
                    alt="حل فلتر الماء الذكي"
                    width={800}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </picture>
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
              <motion.div variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
                الحل الذكي
              </motion.div>
              <motion.h2 variants={fadeUp} className="mb-5 font-sans font-extrabold text-3xl leading-[1.1] tracking-[-0.03em] text-brand sm:text-4xl md:text-5xl" dir="rtl">
                حل صغير، ذكي، ومباشر فالروبيني ديالك.
              </motion.h2>
              <motion.p variants={fadeUp} className="mb-8 text-base leading-relaxed text-body sm:text-lg" dir="rtl">
                ماشي ضروري تخسر فلوس صحيحة فأنظمة معقدة ولا تبقى تابع القراعي طول حياتك. الحل كاين فالبلاصة اللي كتستعمل منها الماء كل نهار.
              </motion.p>

              <motion.ul variants={stagger} className="space-y-3">
                {[
                  { emoji: "🔧", text: "كيركب مباشرة فالصنبور المتوافق بلا حفير" },
                  { emoji: "🥛", text: "كيصفي الماء فالنقطة ديال الاستعمال باش تشرب مرتاح" },
                  { emoji: "✨", text: "كيرد للماء المذاق الطبيعي ديالو بلا ريحة الكلور" },
                  { emoji: "💰", text: "كيوفر عليك ميزانية ومساحة القراعي البلاستيكية" },
                ].map(({ emoji, text }) => (
                  <motion.li
                    key={text} variants={cardReveal}
                    className="flex items-center gap-3.5 rounded-xl border border-line bg-white px-4 py-3.5 shadow-soft"
                  >
                    <span className="shrink-0 text-xl">{emoji}</span>
                    <span className="text-sm font-medium text-ink" dir="rtl">{text}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.p variants={fadeUp} className="mt-8 text-sm font-semibold text-brand italic" dir="rtl">
                خطوة بسيطة باش ترجع ثقتك فالماء اللي كتستعملو أنت وعائلتك.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. BEFORE / AFTER
      ══════════════════════════════════════════ */}
      <section className="border-t border-line bg-white py-20 md:py-28">
        <div className="container-x">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
              مقارنة
            </div>
            <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-brand sm:text-4xl" dir="rtl">
              الفرق واضح من النهار الأول.
            </h2>
            <p className="mt-3 text-base text-body" dir="rtl">شوف كيفاش هاد الـ Upgrade الصغير غيغير الكوزينة ديالك.</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Before */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={vp}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-line bg-bg p-8"
              dir="rtl"
            >
              <h3 className="mb-6 flex items-center gap-2.5 text-lg font-bold text-ink/40">
                <span className="h-2 w-2 rounded-full bg-ink/30" />
                قبل استخدام الفلتر
              </h3>
              <ul className="space-y-4">
                {[
                  "ما كتقدرش تشرب من الروبيني حيت ريحتو كلور",
                  "الكوزينة ديما عامرة بقراعي البلاستيك والروينة",
                  "عذاب حمل باك ديال الماء فالدروج كل سيمانة"
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-body leading-relaxed">
                    <span className="mt-1 text-red shrink-0">✕</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* After */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={vp}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border-2 border-brand bg-white p-8 shadow-lift"
              dir="rtl"
            >
              <h3 className="mb-6 flex items-center gap-2.5 text-lg font-bold text-brand">
                <span className="h-2 w-2 rounded-full bg-brand" />
                بعد استخدام الفلتر
              </h3>
              <ul className="space-y-4">
                {[
                  "كتشرب ماء المذاق ديالو نقي وصافي مباشرة",
                  "الكوزينة منظمة ومطلوقة بلا قراعي بلاستيك زوينة",
                  "كترتاح وتوفر الفلوس والجهد كل سيمانة"
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm font-semibold text-ink leading-relaxed">
                    <span className="mt-1 text-cta shrink-0">✓</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <p className="mt-10 text-center text-sm font-bold text-ink" dir="rtl">
            حول الروبيني ديالك لمصدر ديال الراحة فدارك.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. HOW IT WORKS (BELIEVABLE MECHANISM)
      ══════════════════════════════════════════ */}
      <section className="border-t border-line bg-bg py-20 md:py-28">
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="order-2 lg:order-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
                التكنولوجيا
              </div>
              <h2 className="mb-5 font-sans font-extrabold text-3xl leading-[1.1] tracking-[-0.03em] text-brand sm:text-4xl md:text-5xl" dir="rtl">
                كيفاش كيخدم هاد الفلتر من الداخل؟
              </h2>
              <p className="mb-8 text-base leading-relaxed text-body sm:text-lg" dir="rtl">
                سر الفلترة كاين فالكارتوشة الذكية اللي كتخدم بمراحل متكاملة (Level 7 Purification) باش تعطيك أحسن نتيجة ممكنة بلا ما تنقص الضغط ديال الماء بزاف.
              </p>

              <div className="space-y-5" dir="rtl">
                <div className="flex gap-4">
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-ink">شبكة التصفية الأولية</h4>
                    <p className="mt-1 text-sm text-body leading-relaxed">
                      كتلتقط الشوائب الكبيرة والترسبات اللي كيبانو فالموجة الأولى باش الماء يجيك صافي ونقي للعين.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-ink">الكربون النشط (Activated Carbon)</h4>
                    <p className="mt-1 text-sm text-body leading-relaxed">
                      مادة فلترة طبيعية كتمتص ريحة وطعم الكلور، حيت هو اللي كيرد للماء المذاق النقي الطبيعي ديالو باش تقدر تشربو براحة تامة.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-8 text-sm italic text-body" dir="rtl">
                نظام بسيط ومجرب، مصمم يخدم مع ماء الروبيني ديالنا بكفاءة.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={vp}
              transition={{ duration: 0.7 }}
              className="order-1 lg:order-2"
            >
              <div className="aspect-square overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
                <picture>
                  <source
                    type="image/webp"
                    srcSet={`${IMG_MECHANISM_SM} 400w, ${IMG_MECHANISM} 800w`}
                    sizes="(max-width: 640px) 90vw, 550px"
                  />
                  <img
                    src={IMG_MECHANISM_PNG}
                    alt="مراحل تصفية الفلتر من الداخل"
                    width={800}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </picture>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. HOW TO USE
      ══════════════════════════════════════════ */}
      <section className="border-t border-line bg-white py-20 md:py-28">
        <div className="container-x">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-12 text-center">
            <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-brand sm:text-4xl" dir="rtl">
              ركبو بوحدك فـ 3 خطوات.
            </h2>
            <p className="mt-3 text-base text-body" dir="rtl">ما كتحتاجش بلومبي ولا أدوات معقدة.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="grid gap-6 sm:grid-cols-3">
            {[
              { num: "1", title: "تأكد من التوافق", desc: "تأكد أن الروبيني ديالك متوافق (شوف دليل الصور لتحت)." },
              { num: "2", title: "ركب الـ Adapter", desc: "ركب الـ Adapter المناسب للروبيني ديالك بلا حتى شي أداة معقدة." },
              { num: "3", title: "زير واستمتع", desc: "زير الفلتر، طلق الماء، واستمتع بماء نقي من النهار الأول (معاه فيديو QR كيشرح كلشي)." },
            ].map((step) => (
              <motion.div
                key={step.num} variants={cardReveal}
                className="rounded-2xl border border-line bg-bg p-6 text-center"
                dir="rtl"
              >
                <span className="mx-auto mb-4 grid h-10 w-10 place-items-center rounded-full bg-brand text-white font-sans font-bold text-lg">
                  {step.num}
                </span>
                <h3 className="mb-2 text-base font-bold text-ink">{step.title}</h3>
                <p className="text-sm leading-relaxed text-body">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. VALUE STACK & 3-TIER OFFER
      ══════════════════════════════════════════ */}
      <section className="border-t border-line bg-bg py-20 md:py-28" id="pricing-section">
        <div className="container-x">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
              العروض المتوفرة
            </div>
            <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-ink sm:text-4xl" dir="rtl">
              اختار الباقة اللي كتناسبك
            </h2>
            <p className="mt-3 text-base text-body" dir="rtl">أثمنة مناسبة مع كارتوشات إضافية لتوفير أكثر.</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {OFFERS.map((offer) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={vp}
                transition={{ duration: 0.5 }}
                className={`relative flex flex-col rounded-3xl p-8 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
                  offer.popular ? "border-2 border-brand" : "border border-line"
                }`}
                dir="rtl"
              >
                {offer.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand px-4 py-1 text-xs font-black text-white uppercase tracking-wider shadow-lift">
                    {offer.badge}
                  </span>
                )}
                
                <div className="text-center">
                  <span className="inline-block rounded-full bg-ink/5 px-3 py-1 text-xs font-bold text-ink/70 mb-4">
                    {offer.id === "basic" ? "الأساسي" : offer.id === "target" ? "الاقتصادي" : "العائلي"}
                  </span>
                  <h3 className="text-lg font-black text-ink">{offer.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-body min-h-[40px]">{offer.description}</p>
                  
                  <div className="mt-6 flex items-baseline justify-center gap-2">
                    <span className="font-sans font-black text-5xl text-ink">{offer.price}</span>
                    <span className="text-sm font-bold text-body">درهم</span>
                    <span className="text-xs line-through text-body/40 mr-1">{offer.originalPrice} درهم</span>
                  </div>
                  
                  <div className="mt-1 text-xs font-bold text-cta">وفّر {offer.savings} درهم</div>
                </div>

                <div className="my-6 border-t border-line" />

                <ul className="flex-1 space-y-3 mb-8">
                  <li className="flex items-center gap-2.5 text-xs text-ink/75">
                    <CheckCircle className="h-4 w-4 shrink-0 text-brand" />
                    <span>Adapters تركيب لجميع الصنابير</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-ink/75">
                    <CheckCircle className="h-4 w-4 shrink-0 text-brand" />
                    <span>تصفية Level 7 Purification</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-ink/75">
                    <CheckCircle className="h-4 w-4 shrink-0 text-brand" />
                    <span>توصيل مجاني لجميع المدن</span>
                  </li>
                  {offer.id !== "basic" && (
                    <li className="flex items-center gap-2.5 text-xs font-bold text-brand">
                      <CheckCircle className="h-4 w-4 shrink-0 text-brand" />
                      <span>{offer.id === "target" ? "كارتوشة إضافية فالباقة" : "2 كارتوشات إضافية فالباقة"}</span>
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => handleOrderClick(offer)}
                  className={`w-full justify-center py-3.5 text-sm font-bold ${
                    offer.popular ? "btn-primary" : "btn-ghost border-ink/20 text-ink hover:bg-ink/5"
                  }`}
                >
                  اطلب الفلتر ديالك دابا
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. COD ASSURANCE & TRUST GUARANTEE
      ══════════════════════════════════════════ */}
      <section className="border-t border-line bg-white py-20 md:py-28">
        <div className="container-x mx-auto max-w-2xl">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-10 text-center">
            <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-brand sm:text-4xl" dir="rtl">
              طلب دابا وخلص حتى يوصلك ليديك.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body" dir="rtl">
              ما تخلص حتى تأكد. كنوصلو ليك الفلتر حتى لباب الدار فكل المدن المغربية. تأكد من الباكيج ديالك، عاد خلص بكل أمان. التوصيل سريع والطلب بلا ريسك.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-line bg-bg p-8 text-center"
            dir="rtl"
          >
            <span className="mx-auto mb-4 block text-4xl">🤝</span>
            <h3 className="mb-2 text-lg font-black text-brand">ضمان التوافق التام (شري مرتاح)</h3>
            <p className="text-sm leading-relaxed text-body">
              بغيناك تشري وأنت متأكد 100% بلي الفلتر غيخدم ليك. تأكد من صور الصنابير المتوافقة. يلا وصلك وما ركبش بسبب عدم التوافق، كنضمنو ليك التبديل أو الإرجاع بشروطنا الواضحة. المنتج ديالك والراحة ديالك هي الأولى.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          9. FAQ Accordion
      ══════════════════════════════════════════ */}
      <section className="border-t border-line bg-bg py-20 md:py-28">
        <div className="container-x mx-auto max-w-2xl">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-10 text-center">
            <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-brand sm:text-4xl" dir="rtl">
              الأسئلة الشائعة
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} variants={cardReveal} className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right transition-colors hover:bg-bg/60"
                  dir="rtl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-brand"><HelpCircle className="h-5 w-5" /></span>
                    <span className="text-sm font-semibold text-ink sm:text-base">{faq.q}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-body transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="border-t border-line px-6 pb-5 pt-4 text-sm leading-relaxed text-body" dir="rtl">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          10. URGENCY & SCARCITY (FINAL CTA)
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-ink py-24 md:py-32">
        <div className="noise pointer-events-none absolute inset-0 opacity-[0.025]" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-brand/6 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-white/3 blur-3xl" />

        <div className="container-x relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Product card visual */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={vp}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="group relative mx-auto max-w-sm lg:mx-0"
            >
              <div className="aspect-square overflow-hidden rounded-3xl border border-white/10 shadow-lift">
                <picture>
                  <source
                    type="image/webp"
                    srcSet={`${IMG_PACKAGE_SM} 400w, ${IMG_PACKAGE} 800w`}
                    sizes="(max-width: 640px) 90vw, 350px"
                  />
                  <img
                    src={IMG_PACKAGE_PNG}
                    alt="فلتر ماء الصنبور"
                    width={800}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </picture>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-brand px-6 py-3 text-lg font-bold text-white shadow-lift">
                199 درهم فقط
              </div>
            </motion.div>

            {/* CTA copy */}
            <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
              <motion.h2
                variants={fadeUp}
                className="font-sans font-extrabold text-3xl leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl md:text-5xl"
                dir="rtl"
              >
                الكمية المتوفرة محدودة لهاد الأسبوع.
              </motion.h2>
              
              <motion.ul variants={stagger} className="mt-6 space-y-3 mb-8" dir="rtl">
                {[
                  "الطلب على باقة (الفلتر + الكارتوشة الإضافية) طالع بزاف",
                  "ستوك محدود من الـ Adapters الخاصة بالصنابير المغربية",
                  "التوصيل مجاني وسريع للطلبات الحالية"
                ].map((text, idx) => (
                  <motion.li key={idx} variants={cardReveal} className="flex items-center gap-2.5 text-sm text-white/70">
                    <CheckCircle className="h-4 w-4 shrink-0 text-cta" />
                    <span>{text}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div variants={fadeUp} className="flex items-center gap-3">
                <button
                  onClick={() => handleOrderClick(OFFERS[1])}
                  className="btn-primary group inline-flex px-8 py-4 text-base"
                >
                  <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                  طلب الفلتر ديالك دابا قبل ما يسالي الستوك
                </button>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-6 w-6" fill="white" strokeWidth={0} />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STICKY MOBILE CTA
      ══════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-white/95 backdrop-blur-md shadow-lift md:hidden">
        <div className="flex items-center gap-3 px-4 py-3" dir="rtl">
          <img
            src={IMG_HERO_SM}
            alt=""
            width={44}
            height={44}
            loading="lazy"
            decoding="async"
            className="h-11 w-11 shrink-0 rounded-xl border border-line object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs text-body leading-none">فلتر ماء الصنبور</div>
            <div className="text-base font-bold text-ink leading-tight mt-0.5">{selectedOffer.price} درهم</div>
          </div>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm"
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-5 w-5" fill="white" strokeWidth={0} />
          </a>
          <button onClick={() => setShowForm(true)} className="btn-primary px-5 py-2.5 text-sm">
            اطلب دابا
          </button>
        </div>
      </div>

      <OrderFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        productName={selectedOffer.title}
        productPrice={selectedOffer.price}
        productImage={IMG_HERO}
        productSlug="tap-water-filter"
        productId={`p-wf1-${selectedOffer.id}`}
      />
    </div>
  );
}
