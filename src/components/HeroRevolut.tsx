import { ArrowLeft, Sparkles, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAnalytics } from "../hooks/useAnalytics";
import HeroFeaturedProducts from "./HeroFeaturedProducts";
import { resolveProducts } from "../cms/themeRuntime";
import type {
  HeroFeaturedProductsSettings,
  HeroThemeSettings,
  Product,
  ThemeEditorBlock,
} from "../cms/types";

type Mode = "public" | "preview";

function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  return (
    <video
      muted
      autoPlay
      loop
      playsInline
      preload="auto"
      poster={poster}
      className="absolute inset-0 h-full w-full object-cover"
    >
      {src && <source src={src} type="video/mp4" />}
    </video>
  );
}

function MiniProductCard({
  product,
  cardStyle,
  show,
  mode,
  ctaText,
}: {
  product: Product;
  cardStyle: HeroFeaturedProductsSettings["cardStyle"];
  show: Pick<HeroFeaturedProductsSettings, "showImage" | "showTitle" | "showPrice" | "showOldPrice" | "showBadge" | "showCTA">;
  mode: Mode;
  ctaText?: string;
}) {
  const image = product.images[0] ?? "";

  // ── Revolut portrait style ──────────────────────────────────────────────
  if (cardStyle === "revolut") {
    const inner = (
      <div className="relative overflow-hidden rounded-[28px]" style={{ width: 180, height: 280 }}>
        {image ? (
          <img src={image} alt={product.title} loading="lazy"
            className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-slate-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {show.showBadge && product.badge && (
          <span className="absolute top-3 right-3 rounded-full bg-white/20 backdrop-blur-sm px-2 py-0.5 text-[10px] font-black text-white border border-white/20">
            {product.badge}
          </span>
        )}
        <div className="absolute bottom-3 inset-x-3 rounded-[18px] bg-white/15 backdrop-blur-xl border border-white/25 p-3">
          {show.showTitle && (
            <p className="text-white/60 text-[10px] leading-snug line-clamp-1" dir="auto">
              {product.title}
            </p>
          )}
          {show.showPrice && (
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-white text-base font-black">{product.price}</span>
              <span className="text-white/60 text-[10px]">درهم</span>
              {show.showOldPrice && product.compareAtPrice && (
                <span className="text-white/40 text-[9px] line-through mr-1">{product.compareAtPrice}</span>
              )}
            </div>
          )}
          {show.showCTA && (
            <div className="mt-2 rounded-full bg-white text-slate-950 text-[10px] font-black text-center py-1.5">
              {ctaText || "اشتري الآن"}
            </div>
          )}
        </div>
      </div>
    );
    if (mode === "preview") return <div className="cursor-default">{inner}</div>;
    return <Link to={`/products/${product.slug}`} className="block hover:scale-[1.02] transition-transform duration-300">{inner}</Link>;
  }

  // ── Other card styles ───────────────────────────────────────────────────
  const isPremium = cardStyle === "premium";
  const isGlass = cardStyle === "glass";

  const bg = isPremium
    ? "bg-white/92 backdrop-blur-sm border border-white/40 shadow-lg"
    : isGlass
      ? "bg-white/12 backdrop-blur-md border border-white/20"
      : "bg-white/8 border border-white/12";

  const titleColor = isPremium ? "text-slate-950" : "text-white";
  const priceColor = isPremium ? "text-slate-950" : "text-white";
  const oldPriceColor = isPremium ? "text-slate-400" : "text-white/50";
  const ctaBg = isPremium ? "bg-slate-950 text-white" : "bg-white/20 text-white";

  const inner = (
    <div className={`rounded-[18px] overflow-hidden ${bg} flex flex-col`}>
      {show.showImage && image && (
        <div className="relative h-32 overflow-hidden">
          <img src={image} alt={product.title} loading="lazy"
            className="absolute inset-0 h-full w-full object-cover" />
          {show.showBadge && product.badge && (
            <span className="absolute top-2 right-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-black text-white">
              {product.badge}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {show.showTitle && (
          <p className={`text-[11px] font-bold leading-tight line-clamp-2 ${titleColor}`} dir="auto">
            {product.title}
          </p>
        )}
        {show.showPrice && (
          <div className="flex items-baseline gap-1">
            <span className={`text-xs font-black ${priceColor}`}>{product.price} درهم</span>
            {show.showOldPrice && product.compareAtPrice && (
              <span className={`text-[9px] line-through ${oldPriceColor}`}>{product.compareAtPrice}</span>
            )}
          </div>
        )}
        {show.showCTA && (
          <span className={`mt-auto inline-block rounded-full px-3 py-1 text-[10px] font-bold text-center ${ctaBg}`}>
            {ctaText || "اشتري الآن"}
          </span>
        )}
      </div>
    </div>
  );

  if (mode === "preview") return <div className="cursor-default">{inner}</div>;
  return (
    <Link to={`/products/${product.slug}`} className="block hover:opacity-90 transition-opacity">
      {inner}
    </Link>
  );
}

function HeroProductsStrip({
  products,
  block,
  isMobile,
  mode,
}: {
  products: Product[];
  block: ThemeEditorBlock;
  isMobile: boolean;
  mode: Mode;
}) {
  const s = block.settings as Partial<HeroFeaturedProductsSettings>;
  return (
    <HeroFeaturedProducts
      products={products}
      settings={s as Partial<HeroFeaturedProductsSettings> & { ctaText?: string }}
      isMobile={isMobile}
      mode={mode}
    />
  );
}

function CtaButton({
  text,
  href,
  variant,
  mode,
}: {
  text: string;
  href: string;
  variant: "primary" | "secondary";
  mode: Mode;
}) {
  const { trackHeroCtaClick } = useAnalytics();
  const cls =
    variant === "primary"
      ? "inline-flex items-center gap-2 rounded-full bg-white text-slate-950 px-6 py-3 text-sm font-black shadow-lg hover:bg-slate-100 transition-colors"
      : "inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-6 py-3 text-sm font-bold hover:bg-white/10 transition-colors";

  const inner = (
    <>
      {variant === "primary" && <ArrowLeft className="h-4 w-4" />}
      {text}
    </>
  );

  if (mode === "preview" || !text) {
    return text ? (
      <button type="button" className={cls}>
        {inner}
      </button>
    ) : null;
  }

  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls} onClick={() => trackHeroCtaClick(text)}>
        {inner}
      </a>
    );
  }

  return (
    <Link to={href || "/products"} className={cls} onClick={() => trackHeroCtaClick(text)}>
      {inner}
    </Link>
  );
}

export default function HeroRevolut({
  settings,
  products = [],
  blocks = [],
  mode = "public",
  isMobile = false,
}: {
  settings: HeroThemeSettings;
  products?: Product[];
  blocks?: ThemeEditorBlock[];
  mode?: Mode;
  isMobile?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const {
    title = "",
    subtitle = "",
    primaryCtaText = "اكتشف",
    primaryCtaLink = "/products",
    secondaryCtaText = "",
    secondaryCtaLink = "",
    badgeText = "",
    backgroundStyle = "dark",
    textAlign = "right",
    titleFontSize,
    subtitleFontSize,
    titleColor,
    subtitleColor,
    accentColor,
    mediaPosition = "right",
    media,
    imageUrl = "",
    videoUrl = "",
    posterUrl = "",
    enableVideo = false,
    enableHeroProducts = false,
    enableAnimation = true,
  } = settings;

  const resolvedImage =
    (isMobile && (media?.mobileImage?.url || media?.image?.url)) ||
    media?.image?.url ||
    imageUrl ||
    "";
  const resolvedVideo = media?.video?.url || videoUrl || "";
  const resolvedPoster = media?.poster?.url || posterUrl || resolvedImage;

  const isLight = backgroundStyle === "light";
  const bgClass = {
    dark: "bg-slate-950",
    light: "bg-white",
    gradient: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800",
    glass: "bg-slate-950",
  }[backgroundStyle];

  const baseTextColor = isLight ? "#0f172a" : "#ffffff";
  const resolvedTitleColor =
    isLight && titleColor === "#ffffff" ? "#0f172a" : (titleColor || baseTextColor);
  const resolvedSubtitleColor =
    isLight && subtitleColor === "#cbd5e1" ? "#475569" : (subtitleColor || (isLight ? "#64748b" : "rgba(255,255,255,0.75)"));

  const titlePx = isMobile ? (titleFontSize?.mobile ?? 38) : (titleFontSize?.desktop ?? 82);
  const subtitlePx = isMobile ? (subtitleFontSize?.mobile ?? 15) : (subtitleFontSize?.desktop ?? 18);

  const textAlignClass =
    textAlign === "center" ? "text-center" : textAlign === "left" ? "text-left" : "text-right";
  const ctaJustify =
    textAlign === "center" ? "justify-center" : textAlign === "left" ? "justify-start" : "justify-end";

  const productsBlock = blocks.find((b) => b.type === "featured_products_strip" && b.enabled);
  const isBgLayout = mediaPosition === "background";
  const isTopLayout = mediaPosition === "top";
  const minH = isMobile ? "auto" : `${settings.sectionHeight ?? 720}px`;

  // Resolved product list for bg layout (same logic as HeroProductsStrip)
  const bgProducts = (() => {
    if (!productsBlock) return [] as Product[];
    const s = productsBlock.settings as Partial<HeroFeaturedProductsSettings>;
    return resolveProducts(products, s);
  })();
  const bgShowFlags = productsBlock ? (productsBlock.settings as Partial<HeroFeaturedProductsSettings>) : {};
  const bgShow = {
    showImage: bgShowFlags.showImage ?? true,
    showTitle: bgShowFlags.showTitle ?? true,
    showPrice: bgShowFlags.showPrice ?? true,
    showOldPrice: bgShowFlags.showOldPrice ?? true,
    showBadge: bgShowFlags.showBadge ?? true,
    showCTA: bgShowFlags.showCTA ?? true,
  };

  const hasMedia = resolvedVideo || resolvedImage;

  const mediaEl = hasMedia ? (
    <motion.div
      className="relative overflow-hidden shadow-[0_30px_100px_rgba(15,23,42,0.28)]"
      style={{
        borderRadius: 28,
        minHeight: isMobile ? 220 : 380,
        height: isBgLayout ? "100%" : undefined,
      }}
      initial={enableAnimation && !reduceMotion ? { opacity: 0, y: 32, scale: 0.96 } : false}
      whileInView={enableAnimation && !reduceMotion ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      {enableVideo && resolvedVideo ? (
        <HeroVideo src={resolvedVideo} poster={resolvedPoster} />
      ) : resolvedImage ? (
        <img
          src={resolvedImage}
          alt=""
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </motion.div>
  ) : null;

  const textBlock = (
    <motion.div
      className={`flex min-w-0 flex-col gap-4 ${textAlignClass}`}
      style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
      initial={enableAnimation && !reduceMotion ? { opacity: 0, y: 26 } : false}
      animate={enableAnimation && !reduceMotion ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {badgeText && (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            isLight
              ? "bg-slate-100 border border-slate-200 text-slate-700"
              : "bg-white/15 border border-white/20 text-white"
          } ${textAlign === "center" ? "self-center" : textAlign === "left" ? "self-start" : "self-end"}`}
        >
          <Sparkles className="h-3 w-3" />
          {badgeText}
        </span>
      )}

      <h1
        dir="rtl"
        className="font-black"
        style={{
          fontSize: `clamp(38px, 12vw, ${titlePx}px)`,
          color: resolvedTitleColor,
          lineHeight: isMobile ? 1.02 : 0.96,
          letterSpacing: 0,
          maxWidth: "100%",
          overflowWrap: "anywhere",
          wordBreak: "normal",
        }}
      >
        {title || "عنوان الهيرو"}
      </h1>

      {subtitle && (
        <p
          dir="auto"
          style={{ fontSize: subtitlePx, color: resolvedSubtitleColor, lineHeight: 1.65, maxWidth: isMobile ? "100%" : "620px" }}
        >
          {subtitle}
        </p>
      )}

      <div className={`flex flex-wrap items-center gap-3 ${ctaJustify}`}>
        {primaryCtaText && (
          <CtaButton text={primaryCtaText} href={primaryCtaLink} variant="primary" mode={mode} />
        )}
        {secondaryCtaText && (
          <CtaButton text={secondaryCtaText} href={secondaryCtaLink} variant="secondary" mode={mode} />
        )}
      </div>

      <div className={`flex items-center gap-2 ${ctaJustify}`}>
        <div className="flex">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span
          className="text-[11px] font-medium"
          style={{ color: isLight ? "#94a3b8" : "rgba(255,255,255,0.55)" }}
        >
          {settings.starRatingText || "آلاف العملاء الراضين"}
        </span>
      </div>

      {enableHeroProducts && productsBlock && (
        <HeroProductsStrip
          products={products}
          block={productsBlock}
          isMobile={isMobile}
          mode={mode}
        />
      )}
    </motion.div>
  );

  // Full-bleed background layout — Revolut two-column
  if (isBgLayout) {
    const bgMinH = isMobile ? 420 : 600;
    const ROTATIONS = ["-2deg", "1deg", "-1deg"];
    return (
      <section
        className="relative w-full overflow-hidden bg-slate-950"
        style={{ minHeight: bgMinH }}
        dir="rtl"
      >
        {/* Background media */}
        {enableVideo && resolvedVideo ? (
          <HeroVideo src={resolvedVideo} poster={resolvedPoster} />
        ) : resolvedImage ? (
          <img
            src={resolvedImage}
            alt=""
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        {/* Right-heavy gradient: text on right side (RTL) is readable */}
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950/85 via-slate-950/50 to-slate-950/10" />
        {/* Subtle purple glow top-right */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 70% 0%, rgba(99,102,241,0.5), transparent)",
          }}
        />
        {/* Two-column overlay */}
        <div
          className="relative z-10 flex items-center px-5 py-12 sm:px-10"
          style={{ minHeight: bgMinH }}
        >
          <div
            className="mx-auto grid w-full items-center gap-10"
            style={{
              gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
              maxWidth: 1180,
            }}
          >
            {/* Text column */}
            <div className="flex flex-col gap-5">{textBlock}</div>
            {/* Portrait glass cards column — desktop only */}
            {!isMobile && enableHeroProducts && bgProducts.length > 0 && (
              <div className="flex flex-col gap-4 items-center">
                {bgProducts.slice(0, 3).map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={enableAnimation && !reduceMotion ? { opacity: 0, y: 38, rotate: 0 } : false}
                    whileInView={enableAnimation && !reduceMotion ? { opacity: 1, y: 0, rotate: ROTATIONS[i] ?? "0deg" } : undefined}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ delay: i * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transform: `rotate(${ROTATIONS[i] ?? "0deg"})` }}
                  >
                    <MiniProductCard
                      product={p}
                      cardStyle="revolut"
                      show={bgShow}
                      mode={mode}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Stacked (media top) layout
  if (isTopLayout) {
    return (
      <section className={`w-full overflow-hidden ${bgClass}`} dir="rtl">
        {hasMedia && (
          <div style={{ height: isMobile ? 220 : 340 }} className="relative w-full overflow-hidden">
            {enableVideo && resolvedVideo ? (
              <HeroVideo src={resolvedVideo} poster={resolvedPoster} />
            ) : resolvedImage ? (
              <img src={resolvedImage} alt="" loading="eager" className="h-full w-full object-cover" />
            ) : null}
          </div>
        )}
        <div className="px-6 py-10 sm:px-10">{textBlock}</div>
      </section>
    );
  }

  // Two-column layout (default: right/left)
  const textFirst = mediaPosition !== "left";

  return (
    <section
      className={`relative w-full overflow-hidden ${bgClass}`}
      style={{ minHeight: minH }}
      dir="rtl"
    >
      {!isLight && (
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.45), transparent)",
          }}
        />
      )}
      <div
        className="relative mx-auto grid items-center gap-8 px-6 py-16 sm:px-10"
        style={{
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          maxWidth: 1200,
        }}
      >
        {textFirst ? (
          <>
            {textBlock}
            {mediaEl ?? <div />}
          </>
        ) : (
          <>
            {mediaEl ?? <div />}
            {textBlock}
          </>
        )}
      </div>
    </section>
  );
}
