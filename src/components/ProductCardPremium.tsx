import { ArrowLeft, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { HeroFeaturedProductsSettings, Product } from "../cms/types";

type Mode = "public" | "preview";

export default function ProductCardPremium({
  product,
  mode = "public",
  cardStyle = "premium",
  show,
  ctaText = "اطلب الآن",
}: {
  product: Product;
  mode?: Mode;
  cardStyle?: HeroFeaturedProductsSettings["cardStyle"];
  show: Pick<
    HeroFeaturedProductsSettings,
    "showImage" | "showTitle" | "showPrice" | "showOldPrice" | "showRating" | "showBadge" | "showCTA"
  >;
  ctaText?: string;
}) {
  const image = product.images?.[0] ?? "";
  const isGlass = cardStyle === "glass" || cardStyle === "revolut";
  const inner = (
    <article
      className={`group h-full overflow-hidden rounded-[24px] border p-2 shadow-[0_22px_70px_rgba(15,23,42,0.14)] transition duration-300 ${
        isGlass
          ? "border-white/20 bg-white/12 text-white backdrop-blur-2xl"
          : "border-slate-200/70 bg-white text-slate-950"
      }`}
      dir="rtl"
    >
      {show.showImage && (
        <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-slate-100">
          {image && (
            <img
              src={image}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          )}
          {show.showBadge && product.badge && (
            <span className="absolute right-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-black text-white shadow-lg">
              {product.badge}
            </span>
          )}
        </div>
      )}
      <div className="flex min-h-[150px] flex-col gap-2 p-3">
        {show.showTitle && (
          <h3 className="line-clamp-2 text-base font-black leading-snug" dir="auto">
            {product.title}
          </h3>
        )}
        {show.showRating && (
          <div className="flex items-center gap-1 text-amber-400">
            {[0, 1, 2, 3, 4].map((item) => (
              <Star key={item} className="h-3.5 w-3.5 fill-current" />
            ))}
          </div>
        )}
        {show.showPrice && (
          <div className="mt-auto flex items-baseline gap-2">
            <span className="text-xl font-black text-blue-600">{product.price} درهم</span>
            {show.showOldPrice && product.compareAtPrice && (
              <span className="text-xs font-bold text-slate-400 line-through">{product.compareAtPrice} درهم</span>
            )}
          </div>
        )}
        {show.showCTA && (
          <span className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">
            {ctaText}
            <ArrowLeft className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </article>
  );

  if (mode === "preview") return inner;
  return (
    <Link to={`/products/${product.slug}`} className="block h-full">
      {inner}
    </Link>
  );
}
