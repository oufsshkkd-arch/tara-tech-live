import { Package, ShoppingCart } from "lucide-react";
import type { Product, ProductPageCopy } from "../../cms/types";
import { COPY as DEFAULT_COPY, GENERIC_COPY } from "../../cms/defaultProductCopy";

type Props = {
  product: Product;
  mode: "desktop" | "mobile";
};

function Stars({ n }: { n: number }) {
  return (
    <span className="text-amber-400 text-xs tracking-tight">
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

function Hidden({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 px-4 py-3 flex items-center gap-2 text-xs text-gray-400">
      <span className="text-base leading-none opacity-50">{label.split(" ")[0]}</span>
      <span>{label.split(" ").slice(1).join(" ")} — مخفي</span>
    </div>
  );
}

export default function ProductPagePreview({ product, mode }: Props) {
  const isMobile = mode === "mobile";
  const pc: ProductPageCopy = product.copy ?? DEFAULT_COPY[product.id] ?? GENERIC_COPY;
  const st = pc.sectionToggles ?? {};
  const img = product.images[0];
  const savings = product.compareAtPrice ? product.compareAtPrice - product.price : 0;

  return (
    <div className="font-sans bg-white text-gray-900 pb-12" dir="rtl">

      {/* PromoTicker */}
      {pc.promoTicker.length > 0 && (
        <div className="bg-gray-900 text-white py-2 px-4 overflow-hidden">
          <div className="flex items-center gap-6 text-[11px] font-medium">
            {pc.promoTicker.map((t, i) => (
              <span key={i} className="whitespace-nowrap opacity-90">{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* Hero */}
      <div className={`p-4 ${isMobile ? "space-y-4" : "grid grid-cols-2 gap-6 p-6 max-w-5xl mx-auto"}`}>
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
          {img ? (
            <img src={img} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-gray-300">
              <Package className="w-16 h-16" />
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className={`space-y-3 ${isMobile ? "" : "flex flex-col justify-center"}`}>
          {product.badge && (
            <span className="inline-block rounded-full bg-red-50 text-red-600 text-[11px] font-medium px-3 py-1">
              {product.badge}
            </span>
          )}

          <h1 className="font-extrabold leading-tight text-xl">
            {pc.heroHeadline[0] || product.title}
            {pc.heroHeadline[1] && (
              <span className="block text-gray-400 font-semibold">{pc.heroHeadline[1]}</span>
            )}
          </h1>

          {pc.heroSub && (
            <p className="text-sm text-gray-500 leading-relaxed">{pc.heroSub}</p>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-3xl font-bold">
              {product.price}
              <span className="text-base font-normal text-gray-500 mr-1">درهم</span>
            </span>
            {product.compareAtPrice && (
              <span className="text-base text-gray-400 line-through">{product.compareAtPrice} درهم</span>
            )}
            {savings > 0 && (
              <span className="rounded-full bg-green-50 text-green-700 text-[11px] font-semibold px-2.5 py-1">
                وفر {savings} درهم
              </span>
            )}
          </div>

          {(product.features ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(product.features ?? []).slice(0, 4).map((f, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-xs">
                  <span>{f.icon}</span>{f.text}
                </span>
              ))}
            </div>
          )}

          <button className="w-full rounded-2xl bg-gray-900 text-white py-3.5 font-bold text-sm flex items-center justify-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            اطلب الآن
          </button>

          {pc.scarcityText && (
            <p className="text-center text-xs text-red-500 font-medium">{pc.scarcityText}</p>
          )}
        </div>
      </div>

      {/* Content sections */}
      <div className={`space-y-4 ${isMobile ? "px-4" : "px-6 max-w-3xl mx-auto"}`}>

        {/* Problem */}
        {st.problem === false
          ? <Hidden label="😤 قسم المشكلة" />
          : pc.problems.length > 0 && (
            <div className="rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-base mb-3">{pc.problemTitle || "المشكلة"}</h2>
              <div className="space-y-2">
                {pc.problems.slice(0, 4).map((p, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-lg leading-none mt-0.5">{p.emoji}</span>
                    <span className="text-gray-700">{p.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Solution */}
        {st.solution === false
          ? <Hidden label="✅ قسم الحل" />
          : pc.solutionBullets.length > 0 && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5">
              <h2 className="font-bold text-base mb-3">{pc.solutionTitle || "الحل"}</h2>
              <div className="space-y-2">
                {pc.solutionBullets.slice(0, 4).map((b, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-lg leading-none mt-0.5">{b.emoji}</span>
                    <span className="text-gray-700">{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* How it works */}
        {st.howItWorks === false
          ? <Hidden label="⚙️ كيفاش يشتغل" />
          : pc.howSteps.length > 0 && (
            <div className="rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-base mb-3">{pc.howItWorksTitle}</h2>
              <div className="space-y-2">
                {pc.howSteps[0]?.steps.slice(0, 3).map((s, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="h-6 w-6 rounded-full bg-gray-900 text-white grid place-items-center text-xs font-bold shrink-0">{i + 1}</span>
                    <span className="text-gray-700">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Benefits */}
        {st.benefits === false
          ? <Hidden label="⭐ المميزات" />
          : pc.benefits.length > 0 && (
            <div>
              <h2 className="font-bold text-base mb-3">المميزات</h2>
              <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                {pc.benefits.slice(0, 4).map((b, i) => (
                  <div key={i} className="rounded-xl border border-gray-100 p-4">
                    <div className="text-2xl mb-1.5">{b.emoji}</div>
                    <div className="font-semibold text-sm">{b.title}</div>
                    <div className="text-xs text-gray-500 mt-1 leading-relaxed">{b.body}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Who it's for */}
        {st.whoFor === false
          ? <Hidden label="👤 لمن مناسب؟" />
          : pc.whoFor.length > 0 && (
            <div>
              <h2 className="font-bold text-base mb-3">لمن هو مناسب؟</h2>
              <div className="space-y-3">
                {pc.whoFor.slice(0, 3).map((w, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-2xl">{w.emoji}</span>
                    <div>
                      <div className="font-semibold text-sm">{w.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{w.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Value */}
        {st.value === false
          ? <Hidden label="💰 قسم القيمة" />
          : pc.valueCosts.length > 0 && (
            <div className="rounded-2xl bg-gray-50 p-5">
              <h2 className="font-bold text-base mb-1">{pc.valueTitle}</h2>
              {pc.valueSub && <p className="text-xs text-gray-500 mb-3">{pc.valueSub}</p>}
              <div className="space-y-2">
                {pc.valueCosts.slice(0, 4).map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-base">{c.emoji}</span>
                    <span className="text-gray-700">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Reviews */}
        {st.reviews === false
          ? <Hidden label="💬 التقييمات" />
          : pc.reviews.length > 0 && (
            <div>
              <h2 className="font-bold text-base mb-3">ماذا يقول العملاء؟</h2>
              <div className="space-y-3">
                {pc.reviews.slice(0, 3).map((r, i) => (
                  <div key={i} className="rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{r.name} · <span className="text-gray-400 font-normal">{r.city}</span></span>
                      <Stars n={r.rating} />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                    <p className="text-[11px] text-gray-400 mt-1.5">{r.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Final CTA */}
        {st.finalCta === false
          ? <Hidden label="🚀 آخر قسم" />
          : pc.finalHeadline && (
            <div className="rounded-2xl bg-gray-900 text-white p-6 text-center">
              <h2 className="font-extrabold text-xl mb-2">{pc.finalHeadline}</h2>
              {pc.finalSub && <p className="text-white/60 text-sm mb-5">{pc.finalSub}</p>}
              <button className="rounded-full bg-white text-gray-900 px-8 py-3 font-bold text-sm">
                اطلب الآن
              </button>
            </div>
          )}

      </div>
    </div>
  );
}
