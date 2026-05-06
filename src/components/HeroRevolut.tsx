import { ArrowLeft, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
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
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
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
          <span
            className={`mt-auto inline-block rounded-full px-3 py-1 text-[10px] font-bold text-center ${ctaBg}`}
          >
            {ctaText || "اشتري الآن"}
          </span>
        )}
      </div>
    </div>
  );

  if (mode === "preview") {
    return <div className="cursor-default">{inner}</div>;
  }
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
  const {
    selectionMode = "manual",
    selectedProductIds = [],
    productLimit = 3,
    cardStyle = "premium",
    showImage = true,
    showTitle = true,
    showPrice = true,
    showOldPrice = true,
    showBadge = true,
    showCTA = true,
  } = s;

  let display: Product[] = [];
  if (selectionMode === "manual" && selectedProductIds.length) {
    display = selectedProductIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as Product[];
  }
  if (!display.length) {
    display = products.filter((p) => p.featured && !p.hidden).slice(0, productLimit);
  }
  if (!display.length) {
    display = products.slice(0, productLimit);
  }

  if (!display.length) {
    return (
      <div className="mt-8 rounded-[2rem] border border-dashed border-white/20 bg-white/5 p-5 text-center text-xs font-black text-white/50">
        اختار منتجات من Theme Editor باش يبان Hero Products Strip
      </div>
    );
  }

  const cols = isMobile ? 1 : display.length === 3 ? 3 : 2;

  return (
    <div
      className="mt-8 grid gap-3"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {display.map((product) => (
        <MiniProductCard
          key={product.id}
          product={product}
          cardStyle={cardStyle}
          mode={mode}
          show={{ showImage, showTitle, showPrice, showOldPrice, showBadge, showCTA }}
          ctaText={(s as Record<string, unknown>).ctaText as string | undefined}
        />
      ))}
    </div>
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
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {inner}
      </a>
    );
  }

  return (
    <Link to={href || "/products"} className={cls}>
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
  const resolvedTitleColor = titleColor || baseTextColor;
  const resolvedSubtitleColor = subtitleColor || (isLight ? "#64748b" : "rgba(255,255,255,0.75)");

  const titlePx = isMobile ? (titleFontSize?.mobile ?? 30) : (titleFontSize?.desktop ?? 54);
  const subtitlePx = isMobile ? (subtitleFontSize?.mobile ?? 15) : (subtitleFontSize?.desktop ?? 18);

  const textAlignClass =
    textAlign === "center" ? "text-center" : textAlign === "left" ? "text-left" : "text-right";
  const ctaJustify =
    textAlign === "center" ? "justify-center" : textAlign === "left" ? "justify-start" : "justify-end";

  const productsBlock = blocks.find((b) => b.type === "featured_products_strip" && b.enabled);
  const isBgLayout = mediaPosition === "background";
  const isTopLayout = mediaPosition === "top";
  const minH = isMobile ? "auto" : "560px";

  const hasMedia = resolvedVideo || resolvedImage;

  const mediaEl = hasMedia ? (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: 28,
        minHeight: isMobile ? 220 : 380,
        height: isBgLayout ? "100%" : undefined,
      }}
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
    </div>
  ) : null;

  const textBlock = (
    <div
      className={`flex flex-col gap-4 ${textAlignClass}`}
      style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
    >
      {badgeText && (
        <span
          className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-bold ${
            isLight
              ? "bg-slate-100 border border-slate-200 text-slate-700"
              : "bg-white/15 border border-white/20 text-white"
          }`}
        >
          <Sparkles className="h-3 w-3" />
          {badgeText}
        </span>
      )}

      <h1
        dir="auto"
        className="font-black leading-tight tracking-tight"
        style={{
          fontSize: titlePx,
          color: resolvedTitleColor,
          lineHeight: 1.15,
          letterSpacing: "-0.025em",
          maxWidth: "90%",
        }}
      >
        {title || "عنوان الهيرو"}
      </h1>

      {subtitle && (
        <p
          dir="auto"
          style={{ fontSize: subtitlePx, color: resolvedSubtitleColor, lineHeight: 1.65, maxWidth: "85%" }}
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
    </div>
  );

  // Full-bleed background layout
  if (isBgLayout) {
    return (
      <section
        className={`relative w-full overflow-hidden ${bgClass}`}
        style={{ minHeight: isMobile ? 420 : 560 }}
        dir="rtl"
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
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-slate-950/10" />
        {!isLight && (
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              background:
                "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(99,102,241,0.5), transparent)",
            }}
          />
        )}
        <div className="relative z-10 flex h-full flex-col justify-end px-6 py-14 sm:px-10">
          {textBlock}
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
