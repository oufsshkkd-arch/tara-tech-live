import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Truck, Wallet, ShieldCheck } from "lucide-react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";

type AnimVariant = { initial: Record<string, number>; animate: Record<string, number>; transition: Record<string, unknown> };
const ANIM_VARIANTS: Record<string, AnimVariant> = {
  none:      { initial: {}, animate: {}, transition: {} },
  fadeUp:    { initial: { opacity: 0, y: 32 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  slideLeft: { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  zoom:      { initial: { opacity: 0, scale: 0.92 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
import { useCms } from "../cms/store";

const HERO_IMAGE = "/images/jump-starter/product-hero.jpg";
const FALLBACK_IMAGE = "/images/jump-starter/family-road.jpg";

// Append build timestamp to local paths (/…) so every deploy forces a fresh
// fetch on mobile. CDN URLs (Unsplash etc.) are left untouched.
const bust = (url: string) => {
  if (!url) return url;
  if (!url.startsWith("/")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}_v=${__BUILD_TS__}`;
};

const CARD_W = 320;
const CARD_H = 460;
const GAP = 24;

const DEFAULT_CHIPS = ["الدفع عند الاستلام", "تأكيد قبل الإرسال", "مراجعة المنتج قبل الشحن"];

function HeroVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.setAttribute("webkit-playsinline", "");
  }, []);

  return (
    <video
      key={src || "hero-video"}
      ref={videoRef}
      poster={poster}
      muted
      autoPlay
      loop
      playsInline
      preload="metadata"
      style={{ objectFit: "cover" }}
      className={className}
    >
      {src && <source src={src} type="video/mp4" />}
    </video>
  );
}

export default function Hero() {
  const { hero, products, brand } = useCms();
  const featured = products.filter((p) => p.featured && !p.hidden);
  const middleProduct = featured[0];
  const leftProduct = featured[1] ?? products[1];
  const rightProduct = featured[2] ?? products[2];

  const endTitle = hero.endTitle || "اختيار محرر";
  const endSub = hero.endSub || "منتجات مختارة بعناية، أنيقة ومفيدة، باش تسهل عليك الحياة اليومية.";
  const endCta = hero.endCta || "كتشف الاختيار";
  const trustChips = hero.trustChips?.length ? hero.trustChips : DEFAULT_CHIPS;
  const scarcityLine = hero.scarcityLine || "عروض مختارة متوفرة بكمية محدودة";
  const cardLabel = hero.cardLabel || "اختيار";

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [dims, setDims] = useState({ vw: 1440, vh: 900 });
  useEffect(() => {
    const update = () =>
      setDims({ vw: window.innerWidth, vh: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const endTop = dims.vh * 0.32;
  const endLeft = dims.vw / 2 - CARD_W / 2;

  const midW = useTransform(scrollYProgress, [0, 0.55], [dims.vw, CARD_W]);
  const midH = useTransform(scrollYProgress, [0, 0.55], [dims.vh, CARD_H]);
  const midLeft = useTransform(scrollYProgress, [0, 0.55], [0, endLeft]);
  const midTop = useTransform(scrollYProgress, [0, 0.55], [0, endTop]);
  const midRadius = useTransform(scrollYProgress, [0, 0.55], [0, 32]);

  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.25], [0, -40]);
  const heroStatOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const endTitleOpacity = useTransform(scrollYProgress, [0.45, 0.7], [0, 1]);
  const endTitleY = useTransform(scrollYProgress, [0.45, 0.7], [24, 0]);

  const sideOpacity = useTransform(scrollYProgress, [0.5, 0.85], [0, 1]);
  const leftCardLeft = useTransform(
    scrollYProgress,
    [0.5, 0.85],
    [endLeft - CARD_W - GAP - 80, endLeft - CARD_W - GAP]
  );
  const rightCardLeft = useTransform(
    scrollYProgress,
    [0.5, 0.85],
    [endLeft + CARD_W + GAP + 80, endLeft + CARD_W + GAP]
  );

  const midStatOpacity = useTransform(scrollYProgress, [0.55, 0.8], [0, 1]);
  const midBadgesOpacity = useTransform(scrollYProgress, [0.6, 0.85], [0, 1]);

  const isMobile = dims.vw < 768;
  const activeVideoSrc = bust((isMobile && hero.mobileVideoUrl) ? hero.mobileVideoUrl : hero.videoUrl);
  const activeVideoPoster = bust(hero.videoPoster ?? "");

  const overlayMax = hero.overlayDarkness ?? 0.75;
  const overlayMin = Math.max(0, overlayMax - 0.5);
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.55],
    [overlayMax, overlayMin]
  );
  const overlayBg = useMotionTemplate`rgba(0,0,0,${overlayOpacity})`;

  const bgWhiteOpacity = useTransform(scrollYProgress, [0.35, 0.75], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative -mt-16 md:-mt-20"
      style={{ height: "240vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* White base behind cards */}
        <motion.div
          className="absolute inset-0 bg-bg"
          style={{ opacity: bgWhiteOpacity }}
        />

        {/* MIDDLE CARD — morphing hero photo */}
        <motion.div
          className="absolute overflow-hidden shadow-soft"
          style={{
            width: midW,
            height: midH,
            left: midLeft,
            top: midTop,
            borderRadius: midRadius,
          }}
        >
          {hero.mediaType === "video" ? (
            <>
              {activeVideoPoster && (
                <img
                  src={activeVideoPoster}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <HeroVideo
                src={activeVideoSrc}
                poster={activeVideoPoster}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </>
          ) : (
            <img
              src={bust(hero.videoUrl || HERO_IMAGE)}
              alt=""
              fetchPriority="high"
              loading="eager"
              decoding="async"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <motion.div
            className="absolute inset-0"
            style={{ background: overlayBg }}
          />

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4"
            style={{ opacity: midStatOpacity }}
          >
            <div className="text-xs font-medium text-white/90 mb-1">
              اختيار
            </div>
            <div className="font-sans font-bold text-4xl sm:text-5xl leading-none tracking-tight">
              {middleProduct ? `${middleProduct.price}` : "349"}
              <span className="text-base font-medium align-top ml-1">
                درهم
              </span>
            </div>
            <div className="mt-3 inline-flex items-center rounded-full bg-white text-ink px-4 py-1.5 text-xs font-medium">
              {middleProduct?.title ?? "كتشف"}
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2"
            style={{ opacity: midBadgesOpacity }}
          >
            <div className="flex items-center gap-1.5 rounded-lg bg-white text-ink px-2.5 py-1.5">
              <span className="h-5 w-5 rounded bg-ink text-white grid place-items-center">
                <Wallet className="h-3 w-3" />
              </span>
              <span className="text-[10px] font-bold leading-tight">
                الدفع<br />عند الاستلام
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-white text-ink px-2.5 py-1.5">
              <span className="h-5 w-5 rounded bg-ink text-white grid place-items-center">
                <ShieldCheck className="h-3 w-3" />
              </span>
              <span className="text-[10px] font-bold leading-tight">
                متحقق<br />ومضمون
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* LEFT SIDE CARD */}
        <motion.div
          className="absolute hidden lg:block overflow-hidden rounded-[32px] shadow-soft"
          style={{
            width: CARD_W,
            height: CARD_H,
            left: leftCardLeft,
            top: endTop,
            opacity: sideOpacity,
          }}
        >
          {leftProduct && (
            <>
              <img
                src={bust(leftProduct.images[0])}
                alt={leftProduct.title}
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/45" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                <div className="text-xs font-medium text-white/90 mb-1">
                  اختيار
                </div>
                <div className="font-sans font-bold text-4xl sm:text-5xl leading-none tracking-tight">
                  {leftProduct.price}
                  <span className="text-base font-medium align-top ml-1">
                    درهم
                  </span>
                </div>
                <div className="mt-3 inline-flex items-center rounded-full bg-white text-ink px-4 py-1.5 text-xs font-medium">
                  {leftProduct.title}
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-white text-ink px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="h-7 w-7 rounded-full bg-red/10 text-red grid place-items-center shrink-0">
                    <Sparkles className="h-3 w-3" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium truncate" dir="auto">
                      {leftProduct.title}
                    </div>
                    <div className="text-[9px] text-body">اختيار</div>
                  </div>
                </div>
                <div className="text-[11px] font-semibold whitespace-nowrap">
                  -{leftProduct.compareAtPrice
                    ? leftProduct.compareAtPrice - leftProduct.price
                    : 0}{" "}
                  درهم
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* RIGHT SIDE CARD */}
        <motion.div
          className="absolute hidden lg:block overflow-hidden rounded-[32px] shadow-soft"
          style={{
            width: CARD_W,
            height: CARD_H,
            left: rightCardLeft,
            top: endTop,
            opacity: sideOpacity,
          }}
        >
          {rightProduct && (
            <>
              <img
                src={bust(rightProduct.images[0])}
                alt={rightProduct.title}
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/55" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                <div className="text-xs font-medium text-white/90 mb-1">
                  اختيار
                </div>
                <div className="font-sans font-bold text-4xl sm:text-5xl leading-none tracking-tight">
                  {rightProduct.price}
                  <span className="text-base font-medium align-top ml-1">
                    درهم
                  </span>
                </div>
                <div className="mt-3 inline-flex items-center rounded-full bg-white text-ink px-4 py-1.5 text-xs font-medium">
                  {rightProduct.title}
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-white text-ink px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="h-7 w-7 rounded-full bg-ink/5 grid place-items-center shrink-0">
                    <Truck className="h-3 w-3" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium truncate">
                      التوصيل
                    </div>
                    <div className="text-[9px] text-body">للدار</div>
                  </div>
                </div>
                <div className="text-[11px] font-semibold whitespace-nowrap">
                  مجاني
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* INITIAL HERO TEXT */}
        <motion.div
          className="absolute inset-0 flex items-center pointer-events-none"
          style={{ opacity: heroTextOpacity, y: heroTextY }}
        >
          <div className="container-x w-full pointer-events-auto">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 max-w-3xl text-white">
                {hero.urgencyBadge && (
                  <div
                    className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-md border"
                    style={{
                      backgroundColor: hero.badgeBgColor || "rgba(255,255,255,0.15)",
                      color: hero.badgeColor || "white",
                      borderColor: hero.badgeBgColor ? `${hero.badgeBgColor}60` : "rgba(255,255,255,0.25)",
                    }}
                  >
                    <Sparkles className="h-3 w-3" />
                    {hero.urgencyBadge}
                  </div>
                )}

                {(() => {
                  const tv = ANIM_VARIANTS[hero.titleAnimation ?? "none"];
                  return (
                    <motion.h1
                      data-hero="title"
                      className="font-sans font-extrabold text-[44px] sm:text-[72px] lg:text-[96px] leading-[1.05] tracking-[-0.03em]"
                      dir="auto"
                      initial={tv.initial}
                      animate={tv.animate}
                      transition={tv.transition}
                      style={{
                        ...(hero.titleFontSize ? { fontSize: `${hero.titleFontSize}px` } : {}),
                        ...(hero.titleLineHeight ? { lineHeight: hero.titleLineHeight } : {}),
                        ...(hero.titleLetterSpacing != null ? { letterSpacing: `${hero.titleLetterSpacing}em` } : {}),
                        ...(hero.titleColor ? { color: hero.titleColor } : {}),
                      }}
                    >
                      {hero.headline}
                    </motion.h1>
                  );
                })()}

                {(() => {
                  const sv = ANIM_VARIANTS[hero.subtitleAnimation ?? "none"];
                  return (
                    <motion.p
                      data-hero="subtitle"
                      className="mt-6 max-w-md text-base sm:text-lg text-white/90 leading-relaxed"
                      dir="auto"
                      initial={sv.initial}
                      animate={sv.animate}
                      transition={{ ...sv.transition, delay: 0.1 }}
                      style={{
                        ...(hero.subtitleFontSize ? { fontSize: `${hero.subtitleFontSize}px` } : {}),
                        ...(hero.subtitleLineHeight ? { lineHeight: hero.subtitleLineHeight } : {}),
                        ...(hero.subtitleLetterSpacing != null ? { letterSpacing: `${hero.subtitleLetterSpacing}em` } : {}),
                        ...(hero.subtitleColor ? { color: hero.subtitleColor } : {}),
                      }}
                    >
                      {hero.subheadline}
                    </motion.p>
                  );
                })()}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-7 py-3.5 text-sm font-medium hover:bg-black transition-colors"
                  >
                    {hero.primaryCta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={`https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-3.5 text-sm font-medium hover:bg-white/15 transition-colors"
                  >
                    {hero.secondaryCta}
                  </a>
                </div>

                {/* ── Trust row + scarcity micro-copy ── */}
                <div className="mt-7 flex flex-col gap-3">
                  {/* Trust chips */}
                  <div className="flex flex-wrap items-center gap-2" dir="rtl">
                    {trustChips.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/12 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-[11px] font-medium text-white/90 leading-none"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-white/50 shrink-0" />
                        {item}
                      </span>
                    ))}
                  </div>
                  {/* Scarcity micro-copy */}
                  {scarcityLine && (
                    <p className="text-[11px] text-white/45 tracking-wide" dir="rtl">
                      {scarcityLine}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* INITIAL right outline frame */}
        <motion.div
          className="absolute inset-0 hidden lg:flex items-center pointer-events-none"
          style={{ opacity: heroStatOpacity }}
        >
          <div className="container-x w-full">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7" />
              <div className="lg:col-span-5">
                <div className="relative h-[480px] mx-auto max-w-[420px]">
                  <div
                    className="absolute inset-0 rounded-[40px] border border-white/55"
                    style={{
                      boxShadow:
                        "0 0 0 1px rgba(255,255,255,0.05) inset, 0 30px 80px rgba(0,0,0,0.15)",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
                    <div className="text-sm font-medium text-white/90 mb-2">
                      {cardLabel}
                    </div>
                    <div className="font-sans font-bold text-[64px] sm:text-[80px] leading-none tracking-tight">
                      {middleProduct?.price ?? "349"}
                      <span className="text-2xl font-medium align-top ml-1">
                        درهم
                      </span>
                    </div>
                    <div className="mt-5 inline-flex items-center rounded-full bg-white text-ink px-5 py-2 text-sm font-medium">
                      {middleProduct?.title ?? "كتشف"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* END STATE TITLE */}
        <motion.div
          className="absolute inset-x-0 top-[10vh] text-center pointer-events-none"
          style={{ opacity: endTitleOpacity, y: endTitleY }}
        >
          <div className="container-x pointer-events-auto">
            <h2
              className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.05] tracking-[-0.03em]"
              dir="auto"
            >
              {endTitle}
            </h2>
            <p
              className="mt-4 max-w-xl mx-auto text-body text-base sm:text-lg"
              dir="auto"
            >
              {endSub}
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-7 py-3.5 text-sm font-medium hover:bg-black transition-colors"
              >
                {endCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
