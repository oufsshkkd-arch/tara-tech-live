import type { HeroFeaturedProductsSettings, Product } from "../cms/types";
import { resolveProducts } from "../cms/themeRuntime";
import ProductCardPremium from "./ProductCardPremium";
import ScrollReveal from "./ScrollReveal";

export default function HeroFeaturedProducts({
  products,
  settings,
  isMobile,
  mode,
}: {
  products: Product[];
  settings: Partial<HeroFeaturedProductsSettings> & { ctaText?: string };
  isMobile: boolean;
  mode: "public" | "preview";
}) {
  const {
    showImage = true,
    showTitle = true,
    showPrice = true,
    showOldPrice = true,
    showRating = true,
    showBadge = true,
    showCTA = true,
    cardStyle = "premium",
  } = settings;
  const display = resolveProducts(products, settings);
  const cols = isMobile ? 1 : display.length === 3 ? 3 : 2;

  if (!display.length) {
    return (
      <div className="mt-8 rounded-[2rem] border border-dashed border-white/20 bg-white/5 p-5 text-center text-xs font-black text-white/50">
        اختار منتجات من Theme Editor باش يبان Hero Products Strip
      </div>
    );
  }

  return (
    <div
      className="mt-8 grid gap-4"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {display.map((product, index) => (
        <ScrollReveal key={product.id} delay={index * 0.08} y={36}>
          <ProductCardPremium
            product={product}
            cardStyle={cardStyle}
            mode={mode}
            show={{ showImage, showTitle, showPrice, showOldPrice, showRating, showBadge, showCTA }}
            ctaText={settings.ctaText}
          />
        </ScrollReveal>
      ))}
    </div>
  );
}
