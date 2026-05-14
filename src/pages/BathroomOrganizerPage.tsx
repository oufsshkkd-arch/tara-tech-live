import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Wind, CheckCircle, MessageCircle, Wallet, Truck,
  ShieldCheck, ChevronDown, ArrowLeft, Users, Clock,
  AlertTriangle, Heart, Star, Sparkles, ShoppingCart, Droplets, Grid, Wrench
} from "lucide-react";
import OrderFormModal from "../components/OrderFormModal";
import { useCart } from "../store/cart";

// ─── Product images ───
const IMG_HERO        = "/images/organizer/hero.png";
const IMG_PROBLEM     = "/images/organizer/problem.png";
const IMG_SOLUTION    = "/images/organizer/solution.png";
const IMG_MECHANISM   = "/images/organizer/mechanism.png";
const IMG_NODRILL     = "/images/organizer/nodrill.png";
const IMG_DETAILS     = "/images/organizer/details.png";
const IMG_OFFER       = "/images/organizer/offer.png";
const IMG_PACKAGE     = "/images/organizer/package.png";
const IMG_CTA         = "/images/organizer/cta.png";

// Hero gallery
const IMGS = [IMG_HERO, IMG_SOLUTION, IMG_DETAILS, IMG_OFFER];

const PROMO = [
  { text: "الدفع عند الاستلام", accent: false },
  { text: "شوف الطرد قبل ما تخلص", accent: false },
  { text: "تأكيد قبل الشحن", accent: false },
  { text: "⚡ كمية محدودة فهاد الدفعة", accent: true },
  { text: "تواصل واضح على واتساب", accent: false },
  { text: "توصيل لجميع المدن", accent: false },
  { text: "منتج عملي وأنيق", accent: false },
  { text: "Tara Tech — تكنولوجيا مختارة بعناية", accent: false },
];

const FAQS = [
  { emoji: "🔧", q: "واش كيتعلق بلا حفير؟", a: "إييه، كيتركب باللصاق القوي اللي كيجي معاه، ما كتحتاجش شنيور أو مسامير، وما كيخسرش الزليج." },
  { emoji: "✅", q: "واش مناسب للزليج؟", a: "أكيد، اللصاق مصمم خصيصاً باش يشد مزيان فأسطح الزليج الملساء والنقية فالحمام." },
  { emoji: "🥛", q: "واش فيه 3 كيسان؟", a: "نعم، المنتج فيه 3 كيسان مقلوبين باش يهبط منهم الما وما يتجمعش." },
  { emoji: "🪥", q: "واش فيه موزع السينيال؟", a: "إييه، كيتوفر على موزع سينيال عملي باش تاخد القياس اللي بغيتي بلا ضياع." },
  { emoji: "📦", q: "واش نقدر نحل الطرد قبل الأداء؟", a: "أكيد، كنضمنو ليك تفتح الطرد وتأكد من المنتج قبل ما تخلص." },
];

// ─── Animation system ───
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

// ─── Marquee repeated items ───
const promoItems = [...PROMO, ...PROMO, ...PROMO];

export default function BathroomOrganizerPage() {
  const [activeImg, setActiveImg] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { addItem, openCart } = useCart();

  function addToCart() {
    addItem({
      id: "p-org-1",
      slug: "bathroom-organizer",
      title: "منظم حمام ذكي 3 Cups",
      price: 199,
      image: IMG_HERO,
    });
    openCart();
  }

  return (
    <div className="pb-24 md:pb-0">

      {/* ══════════════════════════════════════════
          PRODUCT ANNOUNCEMENT BAR
      ══════════════════════════════════════════ */}
      <div className="overflow-hidden border-b border-line bg-white py-2.5">
        <div className="flex w-full">
          <div className="marquee-track flex shrink-0 items-center gap-10 pr-10">
            {promoItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 whitespace-nowrap">
                <span className="h-1 w-1 rounded-full bg-ink/15 shrink-0" />
                <span className={`text-[11px] font-semibold tracking-wide ${item.accent ? "text-red" : "text-ink/60"}`}>
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
          <div className="absolute -top-20 -left-20 h-[500px] w-[500px] rounded-full bg-red/5 blur-3xl" />
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
                  <img
                    src={IMGS[activeImg]}
                    alt="منظم حمام ذكي"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="absolute -right-3 -top-3 rounded-full bg-red px-3 py-1.5 text-[11px] font-bold text-white shadow-lift">
                  ⚡ كمية محدودة
                </div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {IMGS.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square overflow-hidden rounded-xl border transition-all duration-200 ${
                      activeImg === i ? "border-ink shadow-sm" : "border-line hover:border-ink/30"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
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
                  <Sparkles className="h-3 w-3 text-red" />
                  المنظم الأكثر مبيعا
                </div>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-sans font-extrabold text-[34px] leading-[1.07] tracking-[-0.03em] text-ink sm:text-4xl lg:text-[46px]"
                dir="rtl"
              >
                حوّل حمامك الصغير
                <br />
                <span className="text-ink/40">لحمام متول بلا حفير</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-4 max-w-md text-base leading-relaxed text-body sm:text-lg" dir="rtl">
                منظم حمام ذكي فيه 3 كيسان، موزع سينيال، رف عملي، وبلاصة للفرش. كيجمع الروينة داللافابو فبلاصة وحدة، وكيتركب بلا شنيور.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-6 flex items-baseline gap-3" dir="rtl">
                <span className="font-sans font-bold text-5xl text-ink">199</span>
                <span className="text-base text-body">درهم</span>
                <span className="text-sm line-through text-body/50">299 درهم</span>
                <span className="pill-red text-xs">كمية محدودة</span>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6 flex flex-col gap-2" dir="rtl">
                <div className="flex gap-3">
                  <button
                    onClick={addToCart}
                    className="btn-primary group flex-1 justify-center py-4 text-base"
                  >
                    <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                    أضف للسلة
                  </button>
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn-ghost px-5 py-4 shrink-0"
                    title="اطلب مباشرة"
                  >
                    اطلب دابا
                  </button>
                </div>
              </motion.div>

              <motion.p variants={fadeUp} className="mt-3 text-center text-xs text-body/50" dir="rtl">
                الدفع عند الاستلام • شوف الطرد قبل ما تخلص • تأكيد قبل الشحن
              </motion.p>

              <motion.ul variants={stagger} className="mt-6 grid grid-cols-2 gap-2">
                {[
                  { icon: "🥛", text: "3 كيسان مقلوبة" },
                  { icon: "🪥", text: "موزع السينيال" },
                  { icon: "🔧", text: "بلا شنيور أو حفير" },
                  { icon: "🧼", text: "رف علوي للمنتجات" },
                ].map((b) => (
                  <motion.li
                    key={b.text}
                    variants={cardReveal}
                    className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink shadow-soft"
                  >
                    <span className="text-base">{b.icon}</span>
                    <span dir="rtl">{b.text}</span>
                  </motion.li>
                ))}
              </motion.ul>

            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. TRUST STRIP
      ══════════════════════════════════════════ */}
      <section className="border-y border-line bg-white py-4">
        <div className="container-x">
          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
            className="flex flex-wrap justify-center gap-5 md:gap-10"
            dir="rtl"
          >
            {[
              { icon: Wallet, label: "الدفع عند الاستلام" },
              { icon: ShieldCheck, label: "شوف الطرد قبل ما تخلص" },
              { icon: CheckCircle, label: "تأكيد قبل الشحن" },
              { icon: Truck, label: "توصيل حتى للدار" },
              { icon: MessageCircle, label: "تواصل على واتساب" },
            ].map(({ icon: Icon, label }) => (
              <motion.div
                key={label} variants={cardReveal}
                className="flex items-center gap-2 text-sm font-medium text-ink/60 transition-colors hover:text-ink"
              >
                <Icon className="h-4 w-4 text-red/60" />
                {label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. PROBLEM
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-ink py-20 md:py-28">
        <div className="noise pointer-events-none absolute inset-0 opacity-[0.025]" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-red/8 blur-3xl" />

        <div className="container-x relative z-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/50">
              🧴 الواقع
            </div>
            <h2 className="font-sans font-extrabold text-3xl leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl md:text-5xl" dir="rtl">
              اللافابو ديما عامر؟
              <br />
              <span className="text-white/35">راه المشكل ماشي فيك</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/45" dir="rtl">
              الحمامات ديال البرارط صغار، والسينيال والفرش والكيسان كيتجمعو فوق الحوض، وكيبان الحمام مرون حتى إلا كان نقي.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { emoji: "🤦", text: "كيسان السنان كيتجمع فيهم الكالكير" },
              { emoji: "🦠", text: "فرشاة السنان معرضة للغبار والبكتيريا" },
              { emoji: "🧴", text: "اللافابو عامر قراعي وكيسان" },
              { emoji: "🧽", text: "صعوبة فتنظيف الحوض كل نهار" },
              { emoji: "🧼", text: "السينيال كيوسخ اللافابو ديما" },
              { emoji: "😥", text: "منظر كيعصب واخا عاد نظفتي" },
            ].map(({ emoji, text }, i) => (
              <motion.div
                key={i} variants={cardReveal}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="flex cursor-default items-start gap-4 rounded-2xl border border-white/8 bg-white/5 p-5 transition-colors hover:border-white/15 hover:bg-white/8"
              >
                <span className="shrink-0 text-2xl">{emoji}</span>
                <p className="text-sm leading-relaxed text-white/65" dir="rtl">{text}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp}
            className="mt-10 text-center text-sm italic text-white/30"
            dir="rtl"
          >
            روينة صغيرة فالحمام كتقدر تعكر ليك المزاج ديال الصباح كامل.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. SOLUTION
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
                <img
                  src={IMG_SOLUTION}
                  alt="الحل"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
              <motion.div variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
                الحل
              </motion.div>
              <motion.h2 variants={fadeUp} className="mb-5 font-sans font-extrabold text-3xl leading-[1.1] tracking-[-0.03em] text-ink sm:text-4xl md:text-5xl" dir="rtl">
                منظم واحد كيجمّع ليك كلشي فبلاصة وحدة
              </motion.h2>
              <motion.p variants={fadeUp} className="mb-8 text-base leading-relaxed text-body sm:text-lg" dir="rtl">
                وداعاً للروينة! هاد المنظم الأنيق كيهز كلشي فوق الحائط وكيرجع اللافابو ديالك فارغ ونقي، باش يعطيك اتساع وراحة نفسية.
              </motion.p>

              <motion.ul variants={stagger} className="space-y-3">
                {[
                  { emoji: "🥛", text: "3 كيسان مقلوبة للعائلة كاملة" },
                  { icon: "🪥", text: "مساحة آمنة ومسدودة لفرشاة الأسنان" },
                  { emoji: "🧽", text: "موزع سينيال عملي واقتصادي" },
                  { emoji: "✨", text: "رف علوي للتخزين اليومي" },
                ].map(({ emoji, icon, text }) => (
                  <motion.li
                    key={text} variants={cardReveal}
                    className="flex items-center gap-3.5 rounded-xl border border-line bg-white px-4 py-3.5 shadow-soft"
                  >
                    <span className="shrink-0 text-xl">{emoji || icon}</span>
                    <span className="text-sm font-medium text-ink" dir="rtl">{text}</span>
                  </motion.li>
                ))}
              </motion.ul>

            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="border-t border-line bg-white py-20 md:py-28">
        <div className="container-x">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
              كيفاش خدام؟
            </div>
            <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-ink sm:text-4xl" dir="rtl">
              ذكي وسهل فالتركيب
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.6 }}
              className="group overflow-hidden rounded-3xl border border-line bg-bg"
            >
              <div className="relative h-52 overflow-hidden">
                <img src={IMG_MECHANISM} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink/75 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
                  <Droplets className="h-4 w-4" />
                  تصريف تلقائي للماء
                </div>
              </div>
              <div className="space-y-3 p-8" dir="rtl">
                <p className="text-sm font-medium text-ink leading-relaxed">
                  بدل ما يبقى كاس السنان عامر بالما وكيربي الكالكير، الكيسان كتكون مقلوبة باش الماء يهبط، والحمام يبقى منظم وأنقى.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="group overflow-hidden rounded-3xl border border-line bg-bg"
            >
              <div className="relative h-52 overflow-hidden">
                <img src={IMG_NODRILL} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink/75 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
                  <Wrench className="h-4 w-4" />
                  بلا حفير ولا شنيور
                </div>
              </div>
              <div className="space-y-3 p-8" dir="rtl">
                <p className="text-sm font-medium text-ink leading-relaxed">
                  كيتركب فوق زليج نقي وناشف بلا شنيور وبلا تخسار. لاصق قوي جداً مصمم باش يهز الثقل ويبقى تابث فالحمام.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. BENEFITS
      ══════════════════════════════════════════ */}
      <section className="bg-bg py-20 md:py-28">
        <div className="container-x">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-12 text-center">
            <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-ink sm:text-4xl" dir="rtl">
              شنو غادي توصلك؟
            </h2>
            <p className="mt-3 text-base text-body" dir="rtl">كلشي مجموع فبواطة وحدة باش تبدا تستعملو مباشرة.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { emoji: "📦", title: "منظم حمام 3 Cups", body: "التصميم الرئيسي باللون الأبيض والرمادي." },
              { emoji: "🪥", title: "موزع سينيال", body: "باش تاخد القياس اللي بغيتي بلا ضياع." },
              { emoji: "🥛", title: "3 كيسان مقلوبة", body: "لغسيل الفم وتصريف الماء بسرعة." },
              { emoji: "🧴", title: "رف علوي", body: "لوضع منتجات التجميل والاستعمال اليومي." },
              { emoji: "🛡️", title: "أماكن مخصصة للفرش", body: "مسدودة ومحمية من الغبار." },
              { emoji: "🖇️", title: "شريط التثبيت", body: "قوي جداً للزليج بلا الحاجة للشنيور." },
            ].map(({ emoji, title, body }) => (
              <motion.div
                key={title} variants={cardReveal}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="cursor-default rounded-2xl border border-line bg-white p-6 shadow-soft"
              >
                <span className="mb-4 block text-3xl">{emoji}</span>
                <h3 className="mb-1.5 text-base font-bold text-ink" dir="rtl">{title}</h3>
                <p className="text-sm leading-relaxed text-body" dir="rtl">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. BEFORE / AFTER (Product Details)
      ══════════════════════════════════════════ */}
      <section className="border-t border-line bg-white py-20 md:py-28">
        <div className="container-x">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-12 text-center">
            <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-ink sm:text-4xl" dir="rtl">
              أناقة وبساطة
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={vp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-line shadow-lift"
          >
            <img
              src={IMG_DETAILS}
              alt="مكونات المنتج"
              className="w-full object-cover"
            />
          </motion.div>

          <motion.p initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mt-10 text-center text-base font-semibold text-ink" dir="rtl">
            كلشي مصمم باش يسهل عليك حياتك اليومية.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          9. VALUE + OFFER
      ══════════════════════════════════════════ */}
      <section className="border-t border-line bg-white py-20 md:py-28">
        <div className="container-x">
          <div className="mx-auto max-w-2xl">
            <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-10 text-center">
              <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-ink sm:text-4xl" dir="rtl">
                اطلب دابا واستافد
              </h2>
            </motion.div>

            {/* Offer box */}
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={vp}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border-2 border-ink bg-bg p-8 text-center shadow-lift md:p-10"
            >
              <div className="mb-4 text-xs font-bold uppercase tracking-widest text-body">عرض الانطلاقة للدفعة الأولى</div>
              <div className="font-sans font-bold text-6xl text-ink">199</div>
              <div className="mb-2 mt-1 text-base text-body">درهم</div>
              <div className="text-sm line-through text-body/50 mb-6">عوض 299 درهم</div>
              
              <div className="mb-7 flex flex-col gap-2.5" dir="rtl">
                {[
                  { icon: Wallet, text: "الدفع عند الاستلام" },
                  { icon: ShieldCheck, text: "شوف الطرد قبل ما تخلص" },
                  { icon: Truck, text: "توصيل حتى للدار" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center justify-center gap-2 text-sm text-ink/70">
                    <Icon className="h-4 w-4 shrink-0 text-red" />
                    {text}
                  </div>
                ))}
              </div>
              <button onClick={() => setShowForm(true)} className="btn-primary group w-full justify-center py-4 text-base">
                <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                طلب دابا بالأداء عند الاستلام
              </button>
              <p className="mt-3 text-xs font-semibold text-red" dir="rtl">⚡ الدفعة الحالية محدودة</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          10. TRUST + FAQ
      ══════════════════════════════════════════ */}
      <section className="border-t border-line bg-bg py-20 md:py-28">
        <div className="container-x mx-auto max-w-2xl">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-10 text-center">
            <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-ink sm:text-4xl" dir="rtl">
              طلب بلا خوف
            </h2>
            <p className="mt-3 text-base leading-relaxed text-body" dir="rtl">
              الثقة هي الأساس ديالنا، وداكشي علاش وفرنا ليك أحسن ضمانات قبل ما تشري.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="mb-12 grid gap-3 sm:grid-cols-2">
            {[
              { icon: ShieldCheck, label: "شوف الطرد قبل ما تخلص" },
              { icon: Wallet, label: "الدفع عند الاستلام" },
              { icon: Truck, label: "توصيل لجميع المدن" },
              { icon: CheckCircle, label: "تأكيد الطلب قبل الشحن" },
            ].map(({ icon: Icon, label }) => (
              <motion.div key={label} variants={cardReveal} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-soft" dir="rtl">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-ink">{label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} variants={cardReveal} className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right transition-colors hover:bg-bg/60"
                  dir="rtl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{faq.emoji}</span>
                    <span className="text-sm font-medium text-ink sm:text-base">{faq.q}</span>
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
          11. FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-ink py-24 md:py-32">
        <div className="noise pointer-events-none absolute inset-0 opacity-[0.025]" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-red/6 blur-3xl" />
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
                <img src={IMG_CTA} alt="منظم حمام ذكي" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-red px-6 py-3 text-lg font-bold text-white shadow-lift">
                199 درهم
              </div>
            </motion.div>

            {/* CTA copy */}
            <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
              <motion.h2
                variants={fadeUp}
                className="font-sans font-extrabold text-3xl leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl md:text-5xl"
                dir="rtl"
              >
                بغيتي حمامك يولي نقي ومتول بلا حفير؟
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-base leading-relaxed text-white/50" dir="rtl">
                اطلب المنظم الذكي دابا، واستافد من عرض الانطلاقة قبل ما يسالي.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary group inline-flex px-8 py-4 text-base"
                >
                  <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                  اطلب دابا بالأداء عند الاستلام
                </button>
              </motion.div>

              <motion.div variants={stagger} className="mt-6 space-y-2" dir="rtl">
                {["الدفع عند الاستلام", "شوف الطرد قبل ما تخلص", "تأكيد قبل الشحن"].map((t) => (
                  <motion.div key={t} variants={cardReveal} className="flex items-center gap-2 text-sm text-white/35">
                    <CheckCircle className="h-4 w-4 shrink-0 text-red/50" />
                    {t}
                  </motion.div>
                ))}
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
            src={IMG_HERO}
            alt=""
            className="h-11 w-11 shrink-0 rounded-xl border border-line object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs text-body leading-none">منظم حمام ذكي</div>
            <div className="text-base font-bold text-ink leading-tight mt-0.5">199 درهم</div>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary px-5 py-2.5 text-sm">
            اطلب دابا
          </button>
        </div>
      </div>

      <OrderFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        productName="منظم حمام ذكي 3 Cups"
        productPrice={199}
        productImage={IMG_HERO}
        productSlug="bathroom-organizer"
        productId="p-org-1"
      />
    </div>
  );
}
