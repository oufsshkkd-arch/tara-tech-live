import { useEffect, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Sparkles, Truck, Wallet, ShieldCheck } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useCms } from "../cms/store";

const bust = (url: string) => {
  if (!url) return url;
  if (!url.startsWith("/")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}_v=${__BUILD_TS__}`;
};

const CARD_W = 320;
const CARD_H = 460;
const GAP = 24;
const EASE = [0.22, 1, 0.36, 1];

const DEFAULT_CHIPS = ["الدفع عند الاستلام", "تأكيد قبل الإرسال", "مراجعة المنتج قبل الشحن"];

// ── Ambient blur orb ──────────────────────────────────────────────────────────
function Orb({ color, size, x, y, dur, delay = 0 }: {
  color: string; size: number; x: number | string; y: number | string; dur: number; delay?: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        left: x, top: y,
        background: color,
        filter: "blur(80px)",
        opacity: 0.38,
        willChange: "transform",
      }}
      animate={{ x: [0, 55, -28, 18, 0], y: [0, -38, 24, -10, 0] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
    />
  );
}

// ── Hero video ────────────────────────────────────────────────────────────────
function HeroVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => { videoRef.current?.setAttribute("webkit-playsinline", ""); }, []);
  return (
    <video key={src || "hero-video"} ref={videoRef} poster={poster}
      muted autoPlay loop playsInline preload="metadata"
      style={{ objectFit: "cover" }} className={className}>
      {src && <source src={src} type="video/mp4" />}
    </video>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Hero() {
  const { hero, products, brand } = useCms();
  const featured = products.filter((p) => p.featured && !p.hidden);
  const middleProduct = featured[0];
  const leftProduct   = featured[1] ?? products[1];
  const rightProduct  = featured[2] ?? products[2];

  const endTitle    = hero.endTitle    || "اختيار محرر";
  const endSub      = hero.endSub      || "منتجات مختارة بعناية، أنيقة ومفيدة، باش تسهل عليك الحياة اليومية.";
  const endCta      = hero.endCta      || "كتشف الاختيار";
  const trustChips  = hero.trustChips?.length ? hero.trustChips : DEFAULT_CHIPS;
  const scarcityLine = hero.scarcityLine || "عروض مختارة متوفرة بكمية محدودة";
  const cardLabel   = hero.cardLabel   || "اختيار";

  // ── Scroll progress ─────────────────────────────────────────────────────────
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const [dims, setDims] = useState({ vw: 1440, vh: 900 });
  useEffect(() => {
    const update = () => setDims({ vw: window.innerWidth, vh: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const endTop  = dims.vh * 0.32;
  const endLeft = dims.vw / 2 - CARD_W / 2;

  // ── Card morphing ───────────────────────────────────────────────────────────
  const midW      = useTransform(scrollYProgress, [0, 0.55], [dims.vw, CARD_W]);
  const midH      = useTransform(scrollYProgress, [0, 0.55], [dims.vh, CARD_H]);
  const midLeft   = useTransform(scrollYProgress, [0, 0.55], [0, endLeft]);
  const midTop    = useTransform(scrollYProgress, [0, 0.55], [0, endTop]);
  const midRadius = useTransform(scrollYProgress, [0, 0.55], [0, 32]);

  const heroTextOpacity  = useTransform(scrollYProgress, [0, 0.25],   [1, 0]);
  const heroTextY        = useTransform(scrollYProgress, [0, 0.25],   [0, -40]);
  const heroStatOpacity  = useTransform(scrollYProgress, [0, 0.2],    [1, 0]);
  const endTitleOpacity  = useTransform(scrollYProgress, [0.45, 0.7], [0, 1]);
  const endTitleY        = useTransform(scrollYProgress, [0.45, 0.7], [24, 0]);
  const sideOpacity      = useTransform(scrollYProgress, [0.5, 0.85], [0, 1]);
  const leftCardLeft     = useTransform(scrollYProgress, [0.5, 0.85], [endLeft - CARD_W - GAP - 80, endLeft - CARD_W - GAP]);
  const rightCardLeft    = useTransform(scrollYProgress, [0.5, 0.85], [endLeft + CARD_W + GAP + 80, endLeft + CARD_W + GAP]);
  const midStatOpacity   = useTransform(scrollYProgress, [0.55, 0.8], [0, 1]);
  const midBadgesOpacity = useTransform(scrollYProgress, [0.6, 0.85], [0, 1]);
  const scrollIndOp      = useTransform(scrollYProgress, [0, 0.08],   [1, 0]);

  const overlayMax     = hero.overlayDarkness ?? 0.75;
  const overlayMin     = Math.max(0, overlayMax - 0.5);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.55], [overlayMax, overlayMin]);
  const overlayBg      = useMotionTemplate`rgba(0,0,0,${overlayOpacity})`;
  const bgWhiteOpacity = useTransform(scrollYProgress, [0.35, 0.75], [0, 1]);

  // ── 3D tilt (right card outline frame) ─────────────────────────────────────
  const tiltX      = useMotionValue(0);
  const tiltY      = useMotionValue(0);
  const rawRotateX = useTransform(tiltY, [-CARD_H / 2, CARD_H / 2], [8, -8]);
  const rawRotateY = useTransform(tiltX, [-CARD_W / 2, CARD_W / 2], [-8, 8]);
  const rotateX    = useSpring(rawRotateX, { stiffness: 200, damping: 28 });
  const rotateY    = useSpring(rawRotateY, { stiffness: 200, damping: 28 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    tiltX.set(e.clientX - rect.left - rect.width  / 2);
    tiltY.set(e.clientY - rect.top  - rect.height / 2);
  };
  const handleCardMouseLeave = () => { tiltX.set(0); tiltY.set(0); };

  // ── Magnetic CTA button ─────────────────────────────────────────────────────
  const magX       = useMotionValue(0);
  const magY       = useMotionValue(0);
  const springMagX = useSpring(magX, { stiffness: 400, damping: 30 });
  const springMagY = useSpring(magY, { stiffness: 400, damping: 30 });

  const handleMagMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dims.vw < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    magX.set((e.clientX - rect.left - rect.width  / 2) * 0.25);
    magY.set((e.clientY - rect.top  - rect.height / 2) * 0.25);
  };
  const handleMagLeave = () => { magX.set(0); magY.set(0); };

  // ── Media resolution ────────────────────────────────────────────────────────
  const isMobile         = dims.vw < 768;
  const activeVideoSrc   = bust((isMobile && hero.mobileVideoUrl) ? hero.mobileVideoUrl : hero.videoUrl);
  const activeVideoPoster = bust(hero.videoPoster ?? "");
  const cmsFallback      = products.find((p) => p.images?.[0])?.images[0] ?? "";
  const heroImageSrc     = bust(
    (isMobile && hero.mobileImageUrl) || hero.imageUrl ||
    (hero.mediaType === "image" ? hero.videoUrl : "") || cmsFallback,
  );
  const fallbackImageSrc = bust(cmsFallback);
  const handleImageFallback = (event: SyntheticEvent<HTMLImageElement>) => {
    if (!fallbackImageSrc) return;
    const img = event.currentTarget;
    if (img.src.endsWith(fallbackImageSrc)) return;
    img.src = fallbackImageSrc;
  };

  const whatsappLink     = `https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, "")}`;
  const primaryCtaLink   = hero.primaryCtaLink  || "/products";
  const secondaryCtaLink = hero.secondaryCtaLink || whatsappLink;
  const isExt            = (href: string) => /^https?:\/\//i.test(href);
  const textAlign        = hero.textAlign || "right";
  const ctaAlignClass    = textAlign === "center" ? "justify-center" : textAlign === "left" ? "justify-start" : "justify-end";

  // Word-split for stagger animation (RTL-safe: each word is inline-block)
  const words = (hero.headline || "").split(" ").filter(Boolean);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <section ref={ref} className="relative -mt-16 md:-mt-20" style={{ height: "240vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* White base (end state) */}
        <motion.div className="absolute inset-0 bg-bg" style={{ opacity: bgWhiteOpacity }} />

        {/* ── Ambient orbs — live behind hero text ────────────────────────── */}
        <motion.div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: heroTextOpacity }}>
          <Orb color="radial-gradient(circle, rgba(99,102,241,0.75), transparent)"  size={420} x="-5%" y="-10%" dur={14}       />
          <Orb color="radial-gradient(circle, rgba(239,68,68,0.55), transparent)"   size={320} x="60%"  y="15%"  dur={11} delay={2} />
          <Orb color="radial-gradient(circle, rgba(168,85,247,0.45), transparent)"  size={280} x="25%"  y="45%"  dur={16} delay={4} />
        </motion.div>

        {/* ── MIDDLE CARD — full-screen → morphs to product card ──────────── */}
        <motion.div
          className="absolute overflow-hidden shadow-soft"
          style={{
            width: midW, height: midH,
            left: midLeft, top: midTop,
            borderRadius: midRadius,
            willChange: "width, height, left, top",
          }}
        >
          {hero.mediaType === "video" ? (
            <>
              {activeVideoPoster && (
                <img src={activeVideoPoster} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
              )}
              <HeroVideo src={activeVideoSrc} poster={activeVideoPoster} className="absolute inset-0 h-full w-full object-cover" />
            </>
          ) : heroImageSrc ? (
            // Ken Burns: inner img scales independently of the container morph
            <motion.img
              src={heroImageSrc}
              alt=""
              fetchPriority="high"
              loading="eager"
              decoding="async"
              onError={handleImageFallback}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ willChange: "transform" }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/85 to-red/70" />
          )}

          {/* Scroll-driven overlay */}
          <motion.div className="absolute inset-0" style={{ background: overlayBg }} />

          {/* Card stat overlay */}
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4" style={{ opacity: midStatOpacity }}>
            <div className="text-xs font-medium text-white/90 mb-1">اختيار</div>
            <div className="font-sans font-bold text-4xl sm:text-5xl leading-none tracking-tight">
              {middleProduct ? `${middleProduct.price}` : "349"}
              <span className="text-base font-medium align-top ml-1">درهم</span>
            </div>
            <div className="mt-3 inline-flex items-center rounded-full bg-white text-ink px-4 py-1.5 text-xs font-medium">
              {middleProduct?.title ?? "كتشف"}
            </div>
          </motion.div>

          <motion.div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2" style={{ opacity: midBadgesOpacity }}>
            <div className="flex items-center gap-1.5 rounded-lg bg-white text-ink px-2.5 py-1.5">
              <span className="h-5 w-5 rounded bg-ink text-white grid place-items-center"><Wallet className="h-3 w-3" /></span>
              <span className="text-[10px] font-bold leading-tight">الدفع<br />عند الاستلام</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-white text-ink px-2.5 py-1.5">
              <span className="h-5 w-5 rounded bg-ink text-white grid place-items-center"><ShieldCheck className="h-3 w-3" /></span>
              <span className="text-[10px] font-bold leading-tight">متحقق<br />ومضمون</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── LEFT SIDE CARD ──────────────────────────────────────────────── */}
        <motion.div className="absolute hidden lg:block overflow-hidden rounded-[32px] shadow-soft"
          style={{ width: CARD_W, height: CARD_H, left: leftCardLeft, top: endTop, opacity: sideOpacity }}>
          {leftProduct && (
            <>
              <img src={bust(leftProduct.images[0])} alt={leftProduct.title} loading="lazy"
                onError={handleImageFallback} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/45" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                <div className="text-xs font-medium text-white/90 mb-1">اختيار</div>
                <div className="font-sans font-bold text-4xl sm:text-5xl leading-none tracking-tight">
                  {leftProduct.price}<span className="text-base font-medium align-top ml-1">درهم</span>
                </div>
                <div className="mt-3 inline-flex items-center rounded-full bg-white text-ink px-4 py-1.5 text-xs font-medium">{leftProduct.title}</div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-white text-ink px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="h-7 w-7 rounded-full bg-red/10 text-red grid place-items-center shrink-0"><Sparkles className="h-3 w-3" /></span>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium truncate" dir="auto">{leftProduct.title}</div>
                    <div className="text-[9px] text-body">اختيار</div>
                  </div>
                </div>
                <div className="text-[11px] font-semibold whitespace-nowrap">
                  -{leftProduct.compareAtPrice ? leftProduct.compareAtPrice - leftProduct.price : 0} درهم
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* ── RIGHT SIDE CARD ─────────────────────────────────────────────── */}
        <motion.div className="absolute hidden lg:block overflow-hidden rounded-[32px] shadow-soft"
          style={{ width: CARD_W, height: CARD_H, left: rightCardLeft, top: endTop, opacity: sideOpacity }}>
          {rightProduct && (
            <>
              <img src={bust(rightProduct.images[0])} alt={rightProduct.title} loading="lazy"
                onError={handleImageFallback} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/55" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                <div className="text-xs font-medium text-white/90 mb-1">اختيار</div>
                <div className="font-sans font-bold text-4xl sm:text-5xl leading-none tracking-tight">
                  {rightProduct.price}<span className="text-base font-medium align-top ml-1">درهم</span>
                </div>
                <div className="mt-3 inline-flex items-center rounded-full bg-white text-ink px-4 py-1.5 text-xs font-medium">{rightProduct.title}</div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-white text-ink px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="h-7 w-7 rounded-full bg-ink/5 grid place-items-center shrink-0"><Truck className="h-3 w-3" /></span>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium truncate">التوصيل</div>
                    <div className="text-[9px] text-body">للدار</div>
                  </div>
                </div>
                <div className="text-[11px] font-semibold whitespace-nowrap">مجاني</div>
              </div>
            </>
          )}
        </motion.div>

        {/* ── HERO TEXT LAYER ──────────────────────────────────────────────── */}
        <motion.div className="absolute inset-0 flex items-center pointer-events-none" style={{ opacity: heroTextOpacity, y: heroTextY }}>
          <div className="container-x w-full pointer-events-auto">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 max-w-3xl text-white" style={{ textAlign }}>

                {/* Badge */}
                {hero.urgencyBadge && (
                  <motion.div
                    className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-md border"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    style={{
                      backgroundColor: hero.badgeBgColor || "rgba(255,255,255,0.15)",
                      color: hero.badgeColor || "white",
                      borderColor: hero.badgeBgColor ? `${hero.badgeBgColor}60` : "rgba(255,255,255,0.25)",
                    }}
                  >
                    <Sparkles className="h-3 w-3" />
                    {hero.urgencyBadge}
                  </motion.div>
                )}

                {/* ── Word-split headline — each word fades + lifts in stagger ── */}
                <h1
                  data-hero="title"
                  dir="auto"
                  className="font-sans font-extrabold tracking-[-0.03em]"
                  style={{
                    fontSize: hero.titleFontSize ? `${hero.titleFontSize}px` : "clamp(40px, 7vw, 96px)",
                    lineHeight: hero.titleLineHeight ?? 1.05,
                    letterSpacing: hero.titleLetterSpacing != null ? `${hero.titleLetterSpacing}em` : "-0.03em",
                    color: hero.titleColor || "white",
                  }}
                >
                  {words.map((word, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      style={{ willChange: "transform, opacity" }}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.7, ease: EASE }}
                    >
                      {word}{i < words.length - 1 ? " " : ""}
                    </motion.span>
                  ))}
                </h1>

                {/* ── Subtitle: blur-to-clear after headline finishes ─────────── */}
                <motion.p
                  data-hero="subtitle"
                  dir="auto"
                  className="mt-6 max-w-md text-base sm:text-lg text-white/90 leading-relaxed"
                  initial={{ opacity: 0, filter: "blur(8px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: words.length * 0.08 + 0.18, duration: 0.9, ease: EASE }}
                  style={{
                    ...(hero.subtitleFontSize       ? { fontSize: `${hero.subtitleFontSize}px` }          : {}),
                    ...(hero.subtitleLineHeight      ? { lineHeight: hero.subtitleLineHeight }              : {}),
                    ...(hero.subtitleLetterSpacing != null ? { letterSpacing: `${hero.subtitleLetterSpacing}em` } : {}),
                    ...(hero.subtitleColor           ? { color: hero.subtitleColor }                       : {}),
                  }}
                >
                  {hero.subheadline}
                </motion.p>

                {/* ── CTAs — primary is magnetic on desktop ───────────────────── */}
                <motion.div
                  className={`mt-8 flex flex-wrap items-center gap-3 ${ctaAlignClass}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: words.length * 0.08 + 0.38, duration: 0.7, ease: EASE }}
                >
                  <motion.div
                    onMouseMove={handleMagMove}
                    onMouseLeave={handleMagLeave}
                    style={{ x: springMagX, y: springMagY, display: "inline-flex" }}
                  >
                    {isExt(primaryCtaLink) ? (
                      <a href={primaryCtaLink} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-7 py-3.5 text-sm font-medium hover:bg-black transition-colors">
                        {hero.primaryCta}<ArrowRight className="h-4 w-4" />
                      </a>
                    ) : (
                      <Link to={primaryCtaLink}
                        className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-7 py-3.5 text-sm font-medium hover:bg-black transition-colors">
                        {hero.primaryCta}<ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </motion.div>
                  <a
                    href={secondaryCtaLink}
                    target={isExt(secondaryCtaLink) ? "_blank" : undefined}
                    rel={isExt(secondaryCtaLink) ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-3.5 text-sm font-medium hover:bg-white/15 transition-colors"
                  >
                    {hero.secondaryCta}
                  </a>
                </motion.div>

                {/* ── Trust chips + scarcity ───────────────────────────────────── */}
                <motion.div
                  className="mt-7 flex flex-col gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: words.length * 0.08 + 0.58, duration: 0.7, ease: EASE }}
                >
                  <div className="flex flex-wrap items-center gap-2" dir="rtl">
                    {trustChips.map((item) => (
                      <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-white/12 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-[11px] font-medium text-white/90 leading-none">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/50 shrink-0" />
                        {item}
                      </span>
                    ))}
                  </div>
                  {scarcityLine && <p className="text-[11px] text-white/45 tracking-wide" dir="rtl">{scarcityLine}</p>}
                </motion.div>

              </div>
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT OUTLINE CARD — 3D tilt + pulsing glow ─────────────────── */}
        <motion.div className="absolute inset-0 hidden lg:flex items-center pointer-events-none" style={{ opacity: heroStatOpacity }}>
          <div className="container-x w-full">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7" />
              <div className="lg:col-span-5">
                <div
                  className="relative h-[480px] mx-auto max-w-[420px] pointer-events-auto cursor-default"
                  style={{ perspective: 1200 }}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  {/* Outer border with pulsing glow */}
                  <motion.div
                    className="absolute inset-0 rounded-[40px] border border-white/55"
                    style={{ rotateX, rotateY, willChange: "transform", transformStyle: "preserve-3d" }}
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(255,255,255,0.0), 0 30px 80px rgba(0,0,0,0.15)",
                        "0 0 50px rgba(255,255,255,0.18), 0 30px 80px rgba(0,0,0,0.15)",
                        "0 0 0px rgba(255,255,255,0.0), 0 30px 80px rgba(0,0,0,0.15)",
                      ],
                    }}
                    transition={{ boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                  />
                  {/* Card content also tilts */}
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8"
                    style={{ rotateX, rotateY, willChange: "transform" }}
                  >
                    <div className="text-sm font-medium text-white/90 mb-2">{cardLabel}</div>
                    <div className="font-sans font-bold text-[64px] sm:text-[80px] leading-none tracking-tight">
                      {middleProduct?.price ?? "349"}
                      <span className="text-2xl font-medium align-top ml-1">درهم</span>
                    </div>
                    <div className="mt-5 inline-flex items-center rounded-full bg-white text-ink px-5 py-2 text-sm font-medium">
                      {middleProduct?.title ?? "كتشف"}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── END STATE TITLE ──────────────────────────────────────────────── */}
        <motion.div className="absolute inset-x-0 top-[10vh] text-center pointer-events-none" style={{ opacity: endTitleOpacity, y: endTitleY }}>
          <div className="container-x pointer-events-auto">
            <h2 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.05] tracking-[-0.03em]" dir="auto">
              {endTitle}
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-body text-base sm:text-lg" dir="auto">{endSub}</p>
            <div className="mt-6 flex justify-center">
              <Link to="/products" className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-7 py-3.5 text-sm font-medium hover:bg-black transition-colors">
                {endCta}<ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── SCROLL INDICATOR — bounces, fades out on scroll ─────────────── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
          style={{ opacity: scrollIndOp }}
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-9 w-px rounded-full bg-white/35" />
          <ChevronDown className="h-4 w-4 text-white/45" />
        </motion.div>

      </div>
    </section>
  );
}
