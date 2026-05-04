import { ArrowRight, Sparkles, ShieldCheck, Wallet } from "lucide-react";
import type { HeroContent } from "../../cms/types";
import { useCms } from "../../cms/store";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=2400&q=80";

type Props = {
  data: HeroContent;
  mode: "desktop" | "mobile";
};

export default function HeroPreview({ data, mode }: Props) {
  const { products } = useCms();
  const isMobile = mode === "mobile";
  const overlay = data.overlayDarkness ?? 0.55;
  const cardLabel = data.cardLabel || "اختيار";
  const chips = data.trustChips ?? ["الدفع عند الاستلام", "تأكيد قبل الإرسال", "مراجعة المنتج قبل الشحن"];

  const featured = products.filter((p) => p.featured && !p.hidden);
  const mid = featured[0] ?? products[0];
  const left = featured[1] ?? products[1];
  const right = featured[2] ?? products[2];

  return (
    <div className="font-sans select-none">

      {/* ── STATE 1 : Initial hero text over full-screen image ── */}
      <div className="relative overflow-hidden" style={{ minHeight: isMobile ? 560 : 500, background: "#111" }}>
        <img
          src={data.videoUrl || FALLBACK_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
        />
        <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlay})` }} />

        <div className={`relative z-10 flex flex-col justify-center h-full py-16 ${isMobile ? "px-6 items-center text-center" : "px-16 max-w-3xl"}`}>
          {data.urgencyBadge && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-3 py-1 text-xs font-medium text-white w-fit">
              <Sparkles className="h-3 w-3" />
              {data.urgencyBadge}
            </div>
          )}

          <h1
            className={`font-extrabold leading-[1.05] tracking-[-0.03em] text-white ${isMobile ? "text-4xl" : "text-[52px]"}`}
            dir="auto"
          >
            {data.headline || "العنوان الرئيسي"}
          </h1>

          <p className="mt-4 text-white/85 text-sm leading-relaxed max-w-sm" dir="auto">
            {data.subheadline}
          </p>

          <div className={`mt-6 flex flex-wrap gap-3 ${isMobile ? "justify-center" : ""}`}>
            {data.primaryCta && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white text-gray-900 px-6 py-2.5 text-sm font-semibold">
                {data.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
            {data.secondaryCta && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/30 text-white px-5 py-2.5 text-sm font-medium">
                {data.secondaryCta}
              </span>
            )}
          </div>

          {chips.length > 0 && (
            <div className={`mt-5 flex flex-wrap gap-2 ${isMobile ? "justify-center" : ""}`} dir="rtl">
              {chips.map((chip, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-white/12 border border-white/20 px-3 py-1.5 text-[11px] font-medium text-white/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/50 shrink-0" />
                  {chip}
                </span>
              ))}
            </div>
          )}

          {data.scarcityLine && (
            <p className="mt-3 text-[11px] text-white/40 tracking-wide" dir="rtl">
              {data.scarcityLine}
            </p>
          )}
        </div>
      </div>

      {/* ── Scroll divider ── */}
      <div className="flex items-center justify-center gap-3 bg-gray-100 py-2.5">
        <span className="h-px flex-1 bg-gray-300 max-w-[80px]" />
        <span className="text-[11px] font-medium text-gray-400 tracking-widest uppercase">↓ Scroll</span>
        <span className="h-px flex-1 bg-gray-300 max-w-[80px]" />
      </div>

      {/* ── STATE 2 : End state — white bg + product cards ── */}
      <div className="bg-white pb-10 pt-6">

        {/* Product cards */}
        {!isMobile ? (
          <div className="flex items-end justify-center gap-4 px-8">
            {/* Left card */}
            {left && (
              <div className="relative w-[220px] h-[320px] rounded-[24px] overflow-hidden shadow-lg shrink-0">
                <img src={left.images[0]} alt={left.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/15 to-black/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-3">
                  <div className="text-[10px] font-medium text-white/80 mb-1">{cardLabel}</div>
                  <div className="font-bold text-3xl leading-none">{left.price}<span className="text-sm align-top ml-0.5">درهم</span></div>
                  <div className="mt-2 rounded-full bg-white text-gray-900 px-3 py-1 text-[11px] font-medium">{left.title}</div>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between rounded-xl bg-white text-gray-900 px-2.5 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-5 w-5 rounded-full bg-red/10 text-red grid place-items-center shrink-0">
                      <Sparkles className="h-2.5 w-2.5" />
                    </span>
                    <span className="text-[10px] font-medium truncate max-w-[80px]">{left.title}</span>
                  </div>
                  {left.compareAtPrice && (
                    <span className="text-[10px] font-semibold text-green-600 whitespace-nowrap">-{left.compareAtPrice - left.price}درهم</span>
                  )}
                </div>
              </div>
            )}

            {/* Center card — taller */}
            {mid && (
              <div className="relative w-[260px] h-[380px] rounded-[28px] overflow-hidden shadow-xl shrink-0 z-10">
                <img src={mid.images[0]} alt={mid.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                  <div className="text-xs font-medium text-white/80 mb-1">{cardLabel}</div>
                  <div className="font-bold text-4xl leading-none">{mid.price}<span className="text-base align-top ml-0.5">درهم</span></div>
                  <div className="mt-3 rounded-full bg-white text-gray-900 px-4 py-1.5 text-xs font-medium">{mid.title}</div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-white text-gray-900 px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-6 w-6 rounded bg-gray-900 text-white grid place-items-center shrink-0">
                      <Wallet className="h-3 w-3" />
                    </span>
                    <div>
                      <div className="text-[10px] font-bold leading-tight">الدفع</div>
                      <div className="text-[9px] text-gray-500">عند الاستلام</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-6 w-6 rounded bg-gray-900 text-white grid place-items-center shrink-0">
                      <ShieldCheck className="h-3 w-3" />
                    </span>
                    <div>
                      <div className="text-[10px] font-bold leading-tight">متحقق</div>
                      <div className="text-[9px] text-gray-500">ومضمون</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right card */}
            {right && (
              <div className="relative w-[220px] h-[320px] rounded-[24px] overflow-hidden shadow-lg shrink-0">
                <img src={right.images[0]} alt={right.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/15 to-black/55" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-3">
                  <div className="text-[10px] font-medium text-white/80 mb-1">{cardLabel}</div>
                  <div className="font-bold text-3xl leading-none">{right.price}<span className="text-sm align-top ml-0.5">درهم</span></div>
                  <div className="mt-2 rounded-full bg-white text-gray-900 px-3 py-1 text-[11px] font-medium">{right.title}</div>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between rounded-xl bg-white text-gray-900 px-2.5 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5 shrink-0 text-gray-500" />
                    <span className="text-[10px] font-medium">التوصيل</span>
                  </div>
                  <span className="text-[10px] font-semibold">مجاني</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Mobile: single center card */
          mid && (
            <div className="flex justify-center px-6">
              <div className="relative w-full max-w-[280px] h-[340px] rounded-[28px] overflow-hidden shadow-xl">
                <img src={mid.images[0]} alt={mid.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/45" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                  <div className="text-xs font-medium text-white/80 mb-1">{cardLabel}</div>
                  <div className="font-bold text-4xl leading-none">{mid.price}<span className="text-base align-top ml-0.5">درهم</span></div>
                  <div className="mt-3 rounded-full bg-white text-gray-900 px-4 py-1.5 text-xs font-medium">{mid.title}</div>
                </div>
              </div>
            </div>
          )
        )}

        {/* End title / sub / CTA */}
        <div className="text-center mt-8 px-6">
          <h2
            className={`font-extrabold text-gray-900 leading-tight tracking-tight ${isMobile ? "text-3xl" : "text-4xl"}`}
            dir="auto"
          >
            {data.endTitle || "اختيار محرر"}
          </h2>
          <p className="mt-3 max-w-md mx-auto text-gray-500 text-sm leading-relaxed" dir="auto">
            {data.endSub}
          </p>
          {data.endCta && (
            <div className="mt-5 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-7 py-3 text-sm font-semibold">
                {data.endCta}
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
