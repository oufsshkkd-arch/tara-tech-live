import { useParams, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft, ShieldCheck, Wallet, Truck, MessageCircle,
  Star, ChevronDown, ShoppingCart, CheckCircle, Zap,
  Sparkles, BadgeCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCms } from "../cms/store";
import { useCart } from "../store/cart";
import { useAnalytics } from "../hooks/useAnalytics";
import ProductCard from "../components/ProductCard";
import OrderFormModal from "../components/OrderFormModal";
import { COPY, GENERIC_COPY } from "../cms/defaultProductCopy";

/* ─── Animation system (same as JumpStarterPage) ─── */
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


function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-4 w-4 ${i <= rating ? "fill-amber-400 text-amber-400" : "fill-line text-line"}`} />
      ))}
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const { products, categories, brand } = useCms();
  const { addItem, openCart } = useCart();
  const { trackPageView } = useAnalytics();
  const product = products.find((r) => r.slug === slug && !r.hidden);

  const [activeImg, setActiveImg] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => { setActiveImg(0); }, [slug]);

  // TikTok Pixel: ViewContent — fires once per product slug
  useEffect(() => {
    if (!product) return;
    trackPageView({
      contentId: product.slug || product.id,
      contentName: product.title,
      value: product.price,
    });
  }, [product?.slug, product?.id, product?.price, product?.title, trackPageView]);

  useEffect(() => {
    const handler = () => setShowSticky(window.scrollY > 600);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!product) return <Navigate to="/products" replace />;

  const p = product;
  const cat = categories.find((c) => c.id === p.categoryId);
  const related = products.filter((r) => r.categoryId === p.categoryId && r.id !== p.id && !r.hidden).slice(0, 4);
  const copy = p.copy || COPY[p.id] || GENERIC_COPY;
  const st = copy.sectionToggles ?? {};
  const waPhone = brand.whatsapp.replace(/[^0-9]/g, "");
  const waLink = `https://wa.me/${waPhone}?text=${encodeURIComponent(`سلام Tara Tech، باغي نسوّل على: ${p.title}`)}`;
  const savings = p.compareAtPrice ? p.compareAtPrice - p.price : 0;
  const promoItems = [...copy.promoTicker, ...copy.promoTicker, ...copy.promoTicker];

  function addToCart() {
    addItem({ id: p.id, slug: p.slug, title: p.title, price: p.price, image: p.images[0] });
    openCart();
  }

  const faqs = [
    { emoji: "💰", q: "واش الدفع كيكون عند الاستلام؟", a: "نعم، الدفع عند الاستلام متوفر فجميع مدن المغرب. ما خصكش تخلص حتى وصلك الطرد وشفتيه." },
    { emoji: "📦", q: "واش نقدر نشوف المنتج قبل ما نخلص؟", a: "نعم، هاد النقطة مهمة عندنا. تشوف المنتج قبل الدفع — راحتك أولويتنا." },
    { emoji: "🚚", q: "شحال تاخد التوصيل؟", a: "بين 2 و4 أيام عمل حسب المدينة. كنتاصلو بك قبل التوصيل باش نأكدو." },
    { emoji: "✅", q: "واش كتأكدو الطلب قبل الشحن؟", a: "نعم، كنتاصلو بك دائماً قبل الشحن باش تكون الصورة واضحة." },
    { emoji: "💬", q: "واش كاين دعم على واتساب؟", a: "نعم، تقدر تتواصل معانا مباشرة على واتساب لأي سؤال قبل أو بعد الطلب." },
  ];

  return (
    <div className="pb-24 md:pb-0">

      {/* ══ 0. MARQUEE ══ */}
      {st.marquee !== false && (
      <div className="overflow-hidden border-b border-line bg-white py-2.5">
        <div className="flex w-full">
          <div className="marquee-track flex shrink-0 items-center gap-10 pr-10">
            {promoItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 whitespace-nowrap">
                <span className="h-1 w-1 rounded-full bg-ink/15 shrink-0" />
                <span className="text-[11px] font-semibold tracking-wide text-ink/60">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* ══ 1. HERO ══ */}
      <section className="relative overflow-hidden bg-bg pt-8 pb-20 md:pb-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-20 h-[500px] w-[500px] rounded-full bg-red/5 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-ink/5 blur-3xl" />
        </div>

        <div className="container-x relative z-10">
          <Link to="/products" className="mb-8 inline-flex items-center gap-1.5 text-sm text-ink/40 hover:text-ink transition-colors">
            <ArrowLeft className="h-4 w-4" />
            رجوع للمنتجات
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

            {/* Gallery */}
            <motion.div className="order-1 lg:order-2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>
              <div className="relative group">
                <div className="aspect-square overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
                  {p.images[activeImg] ? (
                    <img src={p.images[activeImg]} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-body/20 text-6xl">📦</div>
                  )}
                </div>
                {p.stock === "low" && (
                  <div className="absolute -right-3 -top-3 rounded-full bg-red px-3 py-1.5 text-[11px] font-bold text-white shadow-lift">
                    ⚡ كمية محدودة
                  </div>
                )}
              </div>
              {p.images.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {p.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} className={`aspect-square overflow-hidden rounded-xl border transition-all duration-200 ${activeImg === i ? "border-ink shadow-sm" : "border-line hover:border-ink/30"}`}>
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Copy */}
            <motion.div className="order-2 lg:order-1" initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp}>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink shadow-soft">
                  <Sparkles className="h-3 w-3 text-red" />
                  {p.badge || cat?.title || "مختار بعناية"}
                </div>
              </motion.div>

              <motion.h1 variants={fadeUp} className="font-sans font-extrabold text-[34px] leading-[1.07] tracking-[-0.03em] text-ink sm:text-4xl lg:text-[46px]" dir="rtl">
                {copy.heroHeadline[0]}
                <br />
                <span className="text-ink/40">{copy.heroHeadline[1]}</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-4 max-w-md text-base leading-relaxed text-body sm:text-lg" dir="rtl">
                {copy.heroSub}
              </motion.p>

              <motion.div variants={fadeUp} className="mt-6 flex items-baseline gap-3 flex-wrap" dir="rtl">
                <span className="font-sans font-bold text-5xl text-ink">{p.price}</span>
                <span className="text-base text-body">درهم</span>
                {p.compareAtPrice && (
                  <>
                    <span className="text-base text-body line-through">{p.compareAtPrice} درهم</span>
                    <span className="pill-red text-xs">وفّر {savings} درهم</span>
                  </>
                )}
                {p.stock === "low" && <span className="pill-red text-xs">كمية محدودة</span>}
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6 flex gap-3" dir="rtl">
                <button onClick={addToCart} className="btn-primary group flex-1 justify-center py-4 text-base">
                  <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                  أضف للسلة
                </button>
                <button onClick={() => setShowForm(true)} className="btn-ghost px-5 py-4 shrink-0">
                  اطلب دابا
                </button>
              </motion.div>

              <motion.p variants={fadeUp} className="mt-3 text-center text-xs text-body/50" dir="rtl">
                {p.codNote || "الدفع عند الاستلام • شوف الطرد قبل ما تخلص • تأكيد قبل الشحن"}
              </motion.p>

              {p.features && p.features.length > 0 && (
                <motion.ul variants={stagger} className="mt-6 grid grid-cols-2 gap-2">
                  {p.features.map((f) => (
                    <motion.li key={f.text} variants={cardReveal} className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink shadow-soft">
                      <span className="text-base">{f.icon}</span>
                      <span dir="rtl">{f.text}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              )}

              <motion.p variants={fadeUp} className="mt-4 text-center text-[11px] text-body/40" dir="rtl">
                {copy.scarcityText}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ 2. TRUST STRIP ══ */}
      <section className="border-y border-line bg-white py-4">
        <div className="container-x">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="flex flex-wrap justify-center gap-5 md:gap-10" dir="rtl">
            {[
              { icon: Wallet, label: "الدفع عند الاستلام" },
              { icon: ShieldCheck, label: "شوف الطرد قبل ما تخلص" },
              { icon: CheckCircle, label: "تأكيد قبل الشحن" },
              { icon: BadgeCheck, label: "مراجعة قبل الإرسال" },
              { icon: MessageCircle, label: "تواصل على واتساب" },
            ].map(({ icon: Icon, label }) => (
              <motion.div key={label} variants={cardReveal} className="flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink transition-colors">
                <Icon className="h-4 w-4 text-red/60" />
                {label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ 3. PROBLEM ══ */}
      {st.problem !== false && (
      <section className="relative overflow-hidden bg-ink py-20 md:py-28">
        <div className="noise pointer-events-none absolute inset-0 opacity-[0.025]" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-red/8 blur-3xl" />
        <div className="container-x relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/50">
              🤔 المشكل
            </div>
            <h2 className="font-sans font-extrabold text-3xl leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl md:text-5xl" dir="rtl">
              {copy.problemTitle}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/45" dir="rtl">{copy.problemSub}</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.problems.map(({ emoji, text }, i) => (
              <motion.div key={i} variants={cardReveal} whileHover={{ y: -3, transition: { duration: 0.2 } }} className="flex cursor-default items-start gap-4 rounded-2xl border border-white/8 bg-white/5 p-5 hover:border-white/15 hover:bg-white/8 transition-colors">
                <span className="shrink-0 text-2xl">{emoji}</span>
                <p className="text-sm leading-relaxed text-white/65" dir="rtl">{text}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mt-10 text-center text-sm italic text-white/30" dir="rtl">
            {copy.problemQuote}
          </motion.p>
        </div>
      </section>
      )}

      {/* ══ 4. SOLUTION ══ */}
      {st.solution !== false && (
      <section className="bg-bg py-20 md:py-28">
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={vp} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="group relative">
              <div className="aspect-square overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
                {p.images[1] || p.images[0] ? (
                  <img src={p.images[1] || p.images[0]} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                ) : (
                  <div className="h-full w-full grid place-items-center text-6xl">📦</div>
                )}
              </div>
              <div className="absolute -bottom-4 -right-4 rounded-2xl border border-line bg-white px-5 py-4 shadow-lift">
                <div className="mb-0.5 text-xs font-bold text-body" dir="rtl">الحل واجد معاك</div>
                <div className="font-bold text-lg text-ink" dir="rtl">{p.price} درهم</div>
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
              <motion.div variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
                الحل
              </motion.div>
              <motion.h2 variants={fadeUp} className="mb-5 font-sans font-extrabold text-3xl leading-[1.1] tracking-[-0.03em] text-ink sm:text-4xl" dir="rtl">
                {copy.solutionTitle}
              </motion.h2>
              <motion.p variants={fadeUp} className="mb-8 text-base leading-relaxed text-body" dir="rtl">
                {copy.solutionSub}
              </motion.p>
              <motion.ul variants={stagger} className="space-y-3">
                {copy.solutionBullets.map(({ emoji, text }) => (
                  <motion.li key={text} variants={cardReveal} className="flex items-center gap-3.5 rounded-xl border border-line bg-white px-4 py-3.5 shadow-soft">
                    <span className="shrink-0 text-xl">{emoji}</span>
                    <span className="text-sm font-medium text-ink" dir="rtl">{text}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.p variants={fadeUp} className="mt-7 text-sm font-medium text-body/70" dir="rtl">
                {copy.solutionQuote}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* ══ 5. HOW IT WORKS ══ */}
      {st.howItWorks !== false && (
      <section className="border-t border-line bg-white py-20 md:py-28">
        <div className="container-x">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
              كيفاش خدام؟
            </div>
            <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-ink sm:text-4xl" dir="rtl">
              {copy.howItWorksTitle}
            </h2>
          </motion.div>

          <div className={`grid gap-6 md:grid-cols-${copy.howSteps.length}`}>
            {copy.howSteps.map(({ label, steps }, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.6, delay: idx * 0.12 }} className="group overflow-hidden rounded-3xl border border-line bg-bg">
                {p.images[idx] && (
                  <div className="relative h-48 overflow-hidden">
                    <img src={p.images[idx] || p.images[0]} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-ink/50 to-ink/10" />
                    <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink/75 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
                      <Zap className="h-4 w-4" />
                      {label}
                    </div>
                  </div>
                )}
                {!p.images[idx] && (
                  <div className="relative h-14 flex items-center px-6">
                    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-sm font-bold text-ink">
                      <Zap className="h-4 w-4" />
                      {label}
                    </span>
                  </div>
                )}
                <div className="space-y-3 p-8" dir="rtl">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">{i + 1}</div>
                      <p className="text-sm font-medium text-ink">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ══ 6. BENEFITS ══ */}
      {st.benefits !== false && (
      <section className="bg-bg py-20 md:py-28">
        <div className="container-x">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-12 text-center">
            <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-ink sm:text-4xl" dir="rtl">
              الفوائد الحقيقية
            </h2>
            <p className="mt-3 text-base text-body" dir="rtl">ما غادي تندم عليه</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {copy.benefits.map(({ emoji, title, body }) => (
              <motion.div key={title} variants={cardReveal} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="cursor-default rounded-2xl border border-line bg-white p-6 shadow-soft">
                <span className="mb-4 block text-3xl">{emoji}</span>
                <h3 className="mb-1.5 text-base font-bold text-ink" dir="rtl">{title}</h3>
                <p className="text-sm leading-relaxed text-body" dir="rtl">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      )}

      {/* ══ 7. WHO IT'S FOR ══ */}
      {st.whoFor !== false && (
      <section className="border-t border-line bg-white py-20 md:py-28">
        <div className="container-x">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-10 text-center">
            <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-ink sm:text-4xl" dir="rtl">
              لمن مناسب؟
            </h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.whoFor.map(({ emoji, title, body }) => (
              <motion.div key={title} variants={cardReveal} whileHover={{ y: -3, transition: { duration: 0.2 } }} className="flex cursor-default items-start gap-4 rounded-2xl border border-line bg-bg p-5 shadow-soft">
                <span className="shrink-0 text-2xl">{emoji}</span>
                <div>
                  <h3 className="mb-1 text-sm font-bold text-ink" dir="rtl">{title}</h3>
                  <p className="text-xs text-body" dir="rtl">{body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      )}

      {/* ══ 8. VALUE + OFFER ══ */}
      {st.value !== false && (
      <section className="border-t border-line bg-bg py-20 md:py-28">
        <div className="container-x">
          <div className="mx-auto max-w-2xl">
            <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-10 text-center">
              <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-ink sm:text-4xl" dir="rtl">
                {copy.valueTitle}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-body" dir="rtl">{copy.valueSub}</p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="mb-8 grid gap-3 sm:grid-cols-2">
              {copy.valueCosts.map(({ emoji, text }) => (
                <motion.div key={text} variants={cardReveal} className="flex items-start gap-3 rounded-xl border border-line bg-bg p-4 text-sm text-body" dir="rtl">
                  <span className="shrink-0 text-xl">{emoji}</span>
                  {text}
                </motion.div>
              ))}
            </motion.div>

            <motion.p initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-8 text-center font-semibold text-ink" dir="rtl">
              {copy.valueConclusion}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 28, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={vp} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="rounded-3xl border-2 border-ink bg-white p-8 text-center shadow-lift md:p-10">
              <div className="mb-4 text-xs font-bold uppercase tracking-widest text-body">العرض الحالي</div>
              <div className="font-sans font-bold text-6xl text-ink">{p.price}</div>
              {p.compareAtPrice && <div className="text-sm text-body line-through mt-1">{p.compareAtPrice} درهم</div>}
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
                اطلب دابا
              </button>
              <p className="mt-3 text-xs font-semibold text-red" dir="rtl">⚡ {copy.scarcityText}</p>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* ══ 9. TRUST + FAQ ══ */}
      <section className="border-t border-line bg-white py-20 md:py-28">
        <div className="container-x mx-auto max-w-2xl">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mb-10 text-center">
            <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-ink sm:text-4xl" dir="rtl">
              الثقة قبل كلشي
            </h2>
            <p className="mt-3 text-base leading-relaxed text-body" dir="rtl">
              كنعرفو بلي أكبر سؤال عندك هو: واش هادشي غادي يخدم بصح؟<br />
              بهاد السبب خدمنا العرض على الثقة ماشي غير على الكلام.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="mb-12 grid gap-3 sm:grid-cols-2">
            {[
              { icon: ShieldCheck, label: "شوف الطرد قبل ما تخلص" },
              { icon: Wallet, label: "الدفع عند الاستلام" },
              { icon: CheckCircle, label: "تأكيد قبل الشحن" },
              { icon: Truck, label: "توصيل لجميع المدن" },
              { icon: MessageCircle, label: "تواصل واضح على واتساب" },
            ].map(({ icon: Icon, label }) => (
              <motion.div key={label} variants={cardReveal} className="flex items-center gap-3 rounded-2xl border border-line bg-bg p-4 shadow-soft" dir="rtl">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-ink">{label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={cardReveal} className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right hover:bg-bg/60 transition-colors" dir="rtl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{faq.emoji}</span>
                    <span className="text-sm font-medium text-ink sm:text-base">{faq.q}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-body transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div key="body" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                      <div className="border-t border-line px-6 pb-5 pt-4 text-sm leading-relaxed text-body" dir="rtl">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ 10. REVIEWS ══ */}
      {st.reviews !== false && (
      <section className="border-t border-line bg-bg py-20 md:py-28">
        <div className="container-x">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
              ⭐ آراء الزبناء
            </div>
            <h2 className="font-sans font-extrabold text-3xl tracking-[-0.03em] text-ink sm:text-4xl" dir="rtl">
              واش قالو الناس
            </h2>
            <div className="mt-4 flex items-center justify-center gap-3">
              <Stars rating={5} />
              <span className="font-bold text-2xl text-ink">4.8</span>
              <span className="text-body text-sm">/ 5 — {copy.reviews.length} تقييم</span>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="grid sm:grid-cols-3 gap-5" dir="rtl">
            {copy.reviews.map((r, i) => (
              <motion.div key={i} variants={cardReveal} className="rounded-2xl border border-line bg-white p-6 shadow-soft flex flex-col gap-3">
                <Stars rating={r.rating} />
                <p className="text-sm text-ink leading-relaxed flex-1">"{r.text}"</p>
                <div className="pt-3 border-t border-line flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">{r.name}</p>
                    <p className="text-xs text-body">{r.city}</p>
                  </div>
                  <span className="text-xs text-body/50">{r.date}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      )}

      {/* ══ 11. FINAL CTA ══ */}
      {st.finalCta !== false && (
      <section className="relative overflow-hidden bg-ink py-24 md:py-32">
        <div className="noise pointer-events-none absolute inset-0 opacity-[0.025]" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-red/6 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-white/3 blur-3xl" />

        <div className="container-x relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={vp} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }} className="group relative mx-auto max-w-sm lg:mx-0">
              <div className="aspect-square overflow-hidden rounded-3xl border border-white/10 shadow-lift">
                {p.images[0] ? (
                  <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                ) : (
                  <div className="h-full w-full grid place-items-center text-6xl bg-white/5">📦</div>
                )}
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-red px-6 py-3 text-lg font-bold text-white shadow-lift">
                {p.price} درهم
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
              <motion.h2 variants={fadeUp} className="font-sans font-extrabold text-3xl leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl md:text-5xl" dir="rtl">
                {copy.finalHeadline}
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-base leading-relaxed text-white/50" dir="rtl">
                {copy.finalSub}
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8">
                <button onClick={() => setShowForm(true)} className="btn-primary group inline-flex px-8 py-4 text-base">
                  <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                  اطلب دابا
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
                ⚡ {copy.scarcityText}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* ══ RELATED ══ */}
      {related.length > 0 && (
        <section className="container-x py-16">
          <div className="flex items-end justify-between mb-8" dir="rtl">
            <h2 className="font-sans font-extrabold text-3xl text-ink tracking-tight">ممكن يعجبك حتى</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((rel) => <ProductCard key={rel.id} product={rel} />)}
          </div>
        </section>
      )}

      {/* ══ STICKY MOBILE BAR ══ */}
      <AnimatePresence>
        {showSticky && (
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-white/95 backdrop-blur-md shadow-lift md:hidden">
            <div className="flex items-center gap-3 px-4 py-3" dir="rtl">
              <div className="h-11 w-11 shrink-0 rounded-xl border border-line overflow-hidden bg-bg">
                {p.images[0] ? <img src={p.images[0]} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full grid place-items-center text-xl">📦</div>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs text-body leading-none">{p.title}</div>
                <div className="text-base font-bold text-ink leading-tight mt-0.5">{p.price} درهم</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setShowForm(true)} className="btn-ghost px-3 py-2.5 text-sm">اطلب</button>
                <a href={waLink} target="_blank" rel="noreferrer" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm" aria-label="WhatsApp">
                  <MessageCircle className="h-5 w-5" fill="white" strokeWidth={0} />
                </a>
                <button onClick={addToCart} className="btn-primary px-4 py-2.5 text-sm">
                  <ShoppingCart className="h-4 w-4" />
                  السلة
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <OrderFormModal open={showForm} onClose={() => setShowForm(false)} productName={p.title} productPrice={p.price} productImage={p.images[0]} />
    </div>
  );
}
