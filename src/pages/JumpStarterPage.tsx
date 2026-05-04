import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Wind, CheckCircle, MessageCircle, Wallet, Truck,
  ShieldCheck, ChevronDown, ArrowLeft, Users, Clock,
  AlertTriangle, Heart, Star, Sparkles, ShoppingCart,
} from "lucide-react";
import OrderFormModal from "../components/OrderFormModal";
import { useCart } from "../store/cart";
import { useCms } from "../cms/store";

// ─── Product images ───
const IMG_TRUNK        = "/images/jump-starter/trunk.jpg";
const IMG_BATTERY      = "/images/jump-starter/battery-jump.jpg";
const IMG_TIRE         = "/images/jump-starter/tire-dacia.jpg";
const IMG_TIRE2        = "/images/jump-starter/tire-close.jpg";
const IMG_BEFORE_AFTER = "/images/jump-starter/before-after.jpg";
const IMG_FAMILY1      = "/images/jump-starter/family-mountains.jpg";
const IMG_FAMILY2      = "/images/jump-starter/family-road.jpg";
const IMG_PRODUCT      = "/images/jump-starter/product-hero.jpg";

// Hero gallery — product hero | trunk | battery jump | tire close-up
const IMGS = [IMG_PRODUCT, IMG_TRUNK, IMG_BATTERY, IMG_TIRE2];

const PROMO = [
  { text: "الدفع عند الاستلام", accent: false },
  { text: "شوف الطرد قبل ما تخلص", accent: false },
  { text: "تأكيد قبل الشحن", accent: false },
  { text: "⚡ كمية محدودة فهاد الدفعة", accent: true },
  { text: "تواصل واضح على واتساب", accent: false },
  { text: "توصيل لجميع المدن", accent: false },
  { text: "منتج عملي للطوارئ", accent: false },
  { text: "Tara Tech — تكنولوجيا مختارة بعناية", accent: false },
];

const FAQS = [
  { emoji: "⚡", q: "واش غادي يخدم بصح؟", a: "إلا كان المشكل فالبطارية الميتة ولا الرويدة الهابطة، فهاد الجهاز معمول باش يعاونك فهاد النوع ديال الطوارئ." },
  { emoji: "✅", q: "واش ساهل فالاستعمال؟", a: "إييه. الفكرة كاملة هي يكون بسيط وعملي، ماشي معقد. ما خاصكش تكون خبير." },
  { emoji: "📦", q: "واش نقدر نشوفو قبل ما نخلص؟", a: "إييه، هادي من أقوى نقاط الثقة فالعرض. تشوفها قبل ما تخلص." },
  { emoji: "✅", q: "واش كيتأكد الطلب قبل الشحن؟", a: "إييه، كنأكدوه قبل الشحن باش تبقى الصورة واضحة بيننا." },
  { emoji: "📲", q: "واش كاين تواصل على واتساب؟", a: "إييه، تقدر تتواصل معانا مباشرة لأي استفسار قبل أو بعد الطلب." },
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

export default function JumpStarterPage() {
  const [activeImg, setActiveImg] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { addItem, openCart } = useCart();
  const { brand } = useCms();
  const waPhone = brand.whatsapp.replace(/[^0-9]/g, "");

  function addToCart() {
    addItem({
      id: "p-js1",
      slug: "jump-starter-air-pump",
      title: "ديمارور وبومبة 2 فـ 1",
      price: 699,
      image: IMG_PRODUCT,
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
        {/* Ambient blobs */}
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
                    alt="ديمارور وبومبة 2 فـ 1"
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
                  جهاز طوارئ 2 فـ 1
                </div>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-sans font-extrabold text-[34px] leading-[1.07] tracking-[-0.03em] text-ink sm:text-4xl lg:text-[46px]"
                dir="rtl"
              >
                ما تبقاش واقف فالطريق
                <br />
                <span className="text-ink/40">بسبب بطارية ولا رويدة</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-4 max-w-md text-base leading-relaxed text-body sm:text-lg" dir="rtl">
                جهاز 2 فـ 1 كيشعل ليك الطوموبيل إلا ماتت البطارية، وكينفخ ليك الروات إلا هبطات. حل عملي، سريع، وديما واجد فالكوفير.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-6 flex items-baseline gap-3" dir="rtl">
                <span className="font-sans font-bold text-5xl text-ink">699</span>
                <span className="text-base text-body">درهم</span>
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
                  { icon: "⚡", text: "يشعل الطوموبيل" },
                  { icon: "💨", text: "ينفخ الروات" },
                  { icon: "✅", text: "ساهل فالاستعمال" },
                  { icon: "📦", text: "فالكوفير ديما" },
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

              <motion.p variants={fadeUp} className="mt-4 text-center text-[11px] text-body/40" dir="rtl">
                الكمية محدودة على الدفعة الحالية
              </motion.p>
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
              { icon: Star, label: "فيديو ديمو حقيقي" },
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
              🚗 الواقع
            </div>
            <h2 className="font-sans font-extrabold text-3xl leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl md:text-5xl" dir="rtl">
              أصعب حاجة ماشي panne...
              <br />
              <span className="text-white/35">أصعب حاجة هي اللي كيتبعها</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/45" dir="rtl">
              واقف فبلاصة خايبة، كتسنى، كتضيع الوقت، وما عارف اشكون تتصل بيه.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { emoji: "😰", text: "كتخاف توقف فالطريق وما شي حد معاك" },
              { emoji: "🙈", text: "كتتحشم تطلب المساعدة من الناس" },
              { emoji: "⏳", text: "كتضيع الوقت فالتسنا والتلفونات" },
              { emoji: "🤷", text: "كتشك فالأثمنة والنيات ديال بعض الناس" },
              { emoji: "💔", text: "كتحس براسك عاجز قدام العائلة" },
              { emoji: "🌙", text: "كتخاف من الليل والطريق الخاوية" },
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
            المشكل كيولي ثقيل حيت ما كيبقاش غير ميكانيكي... كيولي نفسي حتى هو.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. SOLUTION
      ══════════════════════════════════════════ */}
      <section className="bg-bg py-20 md:py-28">
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

            {/* Product image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={vp}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              <div className="aspect-square overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
                <img
                  src={IMG_TRUNK}
                  alt="الحل"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 rounded-2xl border border-line bg-white px-5 py-4 shadow-lift">
                <div className="mb-0.5 text-xs font-bold text-body" dir="rtl">الحل واجد معاك</div>
                <div className="font-bold text-lg text-ink" dir="rtl">699 درهم</div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
              <motion.div variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
                الحل
              </motion.div>
              <motion.h2 variants={fadeUp} className="mb-5 font-sans font-extrabold text-3xl leading-[1.1] tracking-[-0.03em] text-ink sm:text-4xl md:text-5xl" dir="rtl">
                الحل اللي يرد ليك التحكم
              </motion.h2>
              <motion.p variants={fadeUp} className="mb-8 text-base leading-relaxed text-body sm:text-lg" dir="rtl">
                من الطبيعي ما تبغيش تبقى ف مرة محتاج شي حد باش تخرج من موقف بسيط. اللي تبغيه هو حل واضح، سالم، وديما معاك.
              </motion.p>

              <motion.ul variants={stagger} className="space-y-3">
                {[
                  { emoji: "⚡", text: "تدخل سريع بدل التسنا فالطريق" },
                  { emoji: "🛡️", text: "بلا تبعية للناس ولـ dépannage" },
                  { emoji: "🧘", text: "راحة البال — الحل واجد فالكوفير" },
                  { emoji: "🚗", text: "مناسب للحياة اليومية ماشي غير السفر" },
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

              <motion.p variants={fadeUp} className="mt-7 text-sm font-medium text-body/70" dir="rtl">
                الفرق الحقيقي ماشي غير فوجود الجهاز... الفرق فكونك واجد قبل ما يوقع المشكل.
              </motion.p>
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
              جوج حالات، جوج حلول
            </h2>
            <p className="mt-3 text-base text-body" dir="rtl">ما خاصكش تكون ميكانيكي.</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Battery card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.6 }}
              className="group overflow-hidden rounded-3xl border border-line bg-bg"
            >
              <div className="relative h-52 overflow-hidden">
                <img src={IMG_BATTERY} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                <div className="absolute inset-0 bg-gradient-to-b from-ink/50 to-ink/10" />
                <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink/75 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
                  <Zap className="h-4 w-4" />
                  إلا ماتت البطارية
                </div>
              </div>
              <div className="space-y-3 p-8" dir="rtl">
                {["كتخرج الجهاز من الكوفير", "كتركب المشابك فالبطارية", "كتشعل الطوموبيل", "وكتكمل طريقك ⚡"].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">{i + 1}</div>
                    <p className="text-sm font-medium text-ink">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tire card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="group overflow-hidden rounded-3xl border border-line bg-bg"
            >
              <div className="relative h-52 overflow-hidden">
                <img src={IMG_TIRE2} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                <div className="absolute inset-0 bg-gradient-to-b from-ink/50 to-ink/10" />
                <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink/75 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
                  <Wind className="h-4 w-4" />
                  إلا هبطات الرويدة
                </div>
              </div>
              <div className="space-y-3 p-8" dir="rtl">
                {["كتركب راس النفخ فالعجلة", "كتشعل الجهاز", "كينفخ الرويدة", "وكتكمل الطريق 💨"].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">{i + 1}</div>
                    <p className="text-sm font-medium text-ink">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.p initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mt-8 text-center text-sm text-body" dir="rtl">
            ما خاصكش تكون ميكانيكي ولا خبير، غير تتبع الطريقة الصحيحة وبساطة الاستعمال ديالو.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. BENEFITS
      ══════════════════════════════════════════ */}
      <section className="bg-bg py-20 md:py-28">
        <div className="container-x">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-12 text-center">
            <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-ink sm:text-4xl" dir="rtl">
              من الصداع للتحكم
            </h2>
            <p className="mt-3 text-base text-body" dir="rtl">ما غادي تكمل تقرا الصفحة حتى تفهم</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { emoji: "🔋", title: "بلا ما تحتاج طوموبيل أخرى", body: "كتحل مشكل البطارية وحدك فدقيقة" },
              { emoji: "💨", title: "سرعة التصرف", body: "كتنفخ الرويدة بسرعة قبل ما يتعقد الموقف" },
              { emoji: "🛡️", title: "وقار وراحة", body: "تنقص الحشومة ديال الوقوف وطلب المساعدة" },
              { emoji: "⏱️", title: "ربح الوقت", body: "تنتهي من المشكل بدل الساعات فالتسنا" },
              { emoji: "👨‍👩‍👧", title: "السفر مع العائلة", body: "راحة بال أكثر فالخرجات والرحلات الطويلة" },
              { emoji: "💰", title: "اقتصاد مدروس", body: "تتفادى المصاريف المتكررة ديال الحلول المؤقتة" },
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

          <motion.p initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mt-10 text-center text-sm font-medium text-body" dir="rtl">
            حل عملي بسيط، ولكن الأثر ديالو كبير فالنهار ديالك كامل.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. BEFORE / AFTER
      ══════════════════════════════════════════ */}
      <section className="border-t border-line bg-white py-20 md:py-28">
        <div className="container-x">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-12 text-center">
            <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-ink sm:text-4xl" dir="rtl">
              قبل / من بعد
            </h2>
          </motion.div>

          {/* Full before/after photo — the image already has Arabic labels baked in */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={vp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-line shadow-lift"
          >
            <img
              src={IMG_BEFORE_AFTER}
              alt="قبل ومن بعد"
              className="w-full object-cover"
            />
          </motion.div>

          <motion.p initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mt-10 text-center text-base font-semibold text-ink" dir="rtl">
            الفارق الحقيقي؟ من راجل كيتسنى... إلى راجل مستعد.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. WHO IT'S FOR
      ══════════════════════════════════════════ */}
      <section className="bg-bg py-20 md:py-28">
        <div className="container-x">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-10 text-center">
            <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-ink sm:text-4xl" dir="rtl">
              لمن مناسب هاد الجهاز؟
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { emoji: "🚗", title: "السائق اليومي", body: "اللي كيسوق كل نهار للخدمة" },
              { emoji: "👨‍👩‍👧", title: "رب العائلة", body: "اللي كيخرج بالعائلة بزاف" },
              { emoji: "🛣️", title: "المسافر", body: "اللي كيسافر بين المدن" },
              { emoji: "💼", title: "الخدام بالطوموبيل", body: "اللي كيستعمل الطوموبيل فالخدمة" },
              { emoji: "🔧", title: "المستقل", body: "اللي ما باغيش يبقى تابع dépannage" },
              { emoji: "✅", title: "الواجد دايما", body: "اللي يبغي حل حاضر فالكوفير" },
            ].map(({ emoji, title, body }) => (
              <motion.div
                key={title} variants={cardReveal}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="flex cursor-default items-start gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft"
              >
                <span className="shrink-0 text-2xl">{emoji}</span>
                <div>
                  <h3 className="mb-1 text-sm font-bold text-ink" dir="rtl">{title}</h3>
                  <p className="text-xs text-body" dir="rtl">{body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.p initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mt-10 text-center text-base text-body" dir="rtl">
            إلا كانت الطوموبيل جزء من نهارك، فهاد الجهاز ماشي رفاهية...{" "}
            <strong className="text-ink">هاد الجهاز ضرورة ذكية.</strong>
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
                علاش 699 درهم معقولين؟
              </h2>
              <p className="mt-4 text-base leading-relaxed text-body" dir="rtl">
                السؤال الصحيح ماشي: "علاش 699 درهم؟"
                <br />
                السؤال الصحيح هو: شحال غادي يكلفني إلا ما كانش عندي هاد الحل ملي نحتاجو؟
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="mb-8 grid gap-3 sm:grid-cols-2">
              {[
                { emoji: "🚐", text: "dépannage: من 100 إلى 500 درهم أو أكثر" },
                { emoji: "🚛", text: "remorquage: من 200 درهم فأكثر" },
                { emoji: "💨", text: "نفخ الرويدة فموقف مستعجل: الصداع والتسنا" },
                { emoji: "⏰", text: "الوقت والحشومة: ما يتحسبش" },
              ].map(({ emoji, text }) => (
                <motion.div key={text} variants={cardReveal} className="flex items-start gap-3 rounded-xl border border-line bg-bg p-4 text-sm text-body" dir="rtl">
                  <span className="shrink-0 text-xl">{emoji}</span>
                  {text}
                </motion.div>
              ))}
            </motion.div>

            <motion.p initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-8 text-center font-semibold text-ink" dir="rtl">
              مرة وحدة معقولة... ولا كل مرة صداع جديد؟
            </motion.p>

            {/* Offer box */}
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={vp}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border-2 border-ink bg-bg p-8 text-center shadow-lift md:p-10"
            >
              <div className="mb-4 text-xs font-bold uppercase tracking-widest text-body">العرض الحالي</div>
              <div className="font-sans font-bold text-6xl text-ink">699</div>
              <div className="mb-6 mt-1 text-base text-body">درهم</div>
              <div className="mb-7 flex flex-col gap-2.5" dir="rtl">
                {[
                  { icon: Wallet, text: "الدفع عند الاستلام" },
                  { icon: ShieldCheck, text: "شوف الطرد قبل ما تخلص" },
                  { icon: CheckCircle, text: "تأكيد قبل الشحن" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center justify-center gap-2 text-sm text-ink/70">
                    <Icon className="h-4 w-4 shrink-0 text-red" />
                    {text}
                  </div>
                ))}
              </div>
              <button onClick={() => setShowForm(true)} className="btn-primary group w-full justify-center py-4 text-base">
                <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                طلب دابا
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
              الثقة قبل كلشي
            </h2>
            <p className="mt-3 text-base leading-relaxed text-body" dir="rtl">
              حنا عارفين بلي أكبر سؤال عندك هو: واش هادشي غادي يخدم بصح؟
              <br />
              بهاد السبب خدمنا العرض على الثقة ماشي غير على الكلام.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="mb-12 grid gap-3 sm:grid-cols-2">
            {[
              { icon: ShieldCheck, label: "شوف الطرد قبل ما تخلص" },
              { icon: Wallet, label: "الدفع عند الاستلام" },
              { icon: CheckCircle, label: "تأكيد قبل الشحن" },
              { icon: Star, label: "فيديو ديمو حقيقي" },
              { icon: MessageCircle, label: "تواصل واضح على واتساب" },
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
                <img src={IMG_FAMILY2} alt="ديمارور وبومبة 2 فـ 1" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-red px-6 py-3 text-lg font-bold text-white shadow-lift">
                699 درهم
              </div>
            </motion.div>

            {/* CTA copy */}
            <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
              <motion.h2
                variants={fadeUp}
                className="font-sans font-extrabold text-3xl leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl md:text-5xl"
                dir="rtl"
              >
                ما تستناش حتى يوقع المشكل
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-base leading-relaxed text-white/50" dir="rtl">
                القيمة الحقيقية ديالو هي يكون عندك قبل ما تحتاجو. كون واجد قبل ما يوقع المشكل.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary group inline-flex px-8 py-4 text-base"
                >
                  <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                  طلب دابا وخلي الحل ديالك واجد فالكوفير
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

              <motion.p variants={fadeUp} className="mt-5 text-xs font-semibold text-red" dir="rtl">
                ⚡ الدفعة الحالية محدودة — لا تفوتها
              </motion.p>
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
            src={IMG_PRODUCT}
            alt=""
            className="h-11 w-11 shrink-0 rounded-xl border border-line object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs text-body leading-none">ديمارور وبومبة 2 فـ 1</div>
            <div className="text-base font-bold text-ink leading-tight mt-0.5">699 درهم</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowForm(true)}
              className="btn-ghost px-3 py-2.5 text-sm"
            >
              اطلب
            </button>
            <a
              href={`https://wa.me/${waPhone}`}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" fill="white" strokeWidth={0} />
            </a>
            <button
              onClick={addToCart}
              className="btn-primary px-4 py-2.5 text-sm"
            >
              <ShoppingCart className="h-4 w-4" />
              السلة
            </button>
          </div>
        </div>
      </div>

      <OrderFormModal open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
}
