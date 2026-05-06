import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useCms } from "../cms/store";

const DEFAULT_CARDS = [
  {
    id: "rb-1",
    badge: "حياة ذكية",
    title: "تكنولوجيا كتسهل عليك يومك.",
    description:
      "اختارنا ليك أفضل المنتجات اللي كتزيد من الراحة والتنظيم فدارك وفي حياتك اليومية بطريقة ذكية وعملية.",
    ctaText: "كتشف المزيد",
    ctaLink: "/products",
    image:
      "https://images.unsplash.com/photo-1584006682522-dc17d6c0d0cb?auto=format&fit=crop&w=800&q=80",
    theme: "light" as const,
  },
  {
    id: "rb-2",
    badge: "جودة ممتازة",
    title: "منتجات مختارة بعناية.",
    description:
      "الجودة هي الأساس ديالنا. كل منتج داز من تجارب صارمة باش نضمنو ليك تجربة شراء راقية ومضمونة 100%.",
    ctaText: "اطلب دابا",
    ctaLink: "/products",
    image:
      "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?auto=format&fit=crop&w=800&q=80",
    theme: "dark" as const,
  },
];

export default function RevolutBenefits() {
  const cms = useCms();
  const themeEditor = cms.themeSchema?.editor;
  const section = themeEditor?.sections?.find((s) => s.type === "revolutBenefits");
  const settings = section?.settings as { cards?: typeof DEFAULT_CARDS } | undefined;
  const cards = settings?.cards?.length ? settings.cards : DEFAULT_CARDS;

  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {cards.map((card) => {
            const isDark = card.theme === "dark";
            return (
              <div
                key={card.id}
                className={`relative overflow-hidden rounded-[32px] border shadow-sm min-h-[420px] md:min-h-[480px] p-8 md:p-12 group transition-all duration-300 ${
                  isDark
                    ? "bg-ink border-ink hover:shadow-lift"
                    : "bg-white border-line hover:shadow-md"
                }`}
              >
                {isDark && (
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none noise" />
                )}

                <div className="relative z-10 max-w-[280px]">
                  <div
                    className={`mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border ${
                      isDark
                        ? "bg-white/10 text-white border-white/10 backdrop-blur-md"
                        : "bg-bg text-ink border-line"
                    }`}
                  >
                    {card.badge}
                  </div>
                  <h3
                    className={`font-sans font-bold text-3xl md:text-4xl leading-tight mb-4 ${
                      isDark ? "text-white" : "text-ink"
                    }`}
                    dir="rtl"
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`text-sm md:text-base leading-relaxed mb-8 ${
                      isDark ? "text-white/70" : "text-body"
                    }`}
                    dir="rtl"
                  >
                    {card.description}
                  </p>
                  <Link
                    to={card.ctaLink || "/products"}
                    className={`inline-flex items-center gap-2 text-sm font-bold transition-colors ${
                      isDark
                        ? "text-white hover:text-white/80"
                        : "text-ink hover:text-red"
                    }`}
                    dir="rtl"
                  >
                    {card.ctaText}
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </div>

                {/* Tilted Product Image */}
                <div className="absolute -bottom-8 -right-8 w-[280px] md:w-[340px] transition-transform duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2">
                  <div
                    className={`rotate-12 translate-x-8 translate-y-8 rounded-2xl overflow-hidden shadow-2xl border ${
                      isDark ? "border-white/10 bg-ink" : "border-line/50 bg-white"
                    }`}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-auto object-cover aspect-square"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
