import { Link } from "react-router-dom";
import { ArrowUpRight, Home, Car, Plane, Laptop2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCms } from "../cms/store";
import type { CategorySectionContent, Category } from "../cms/types";

const iconMap: Record<string, any> = { Home, Car, Plane, Laptop2 };

// All class strings must be string literals here so Tailwind includes them in
// the production build — dynamic string construction would get purged.
const DESKTOP_GRID: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

const MOBILE_GRID: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
};

export default function Categories({
  categorySection: categorySectionProp,
  categories: categoriesProp,
}: {
  categorySection?: CategorySectionContent;
  categories?: Category[];
} = {}) {
  const cms = useCms();
  const categorySection = categorySectionProp ?? cms.categorySection;
  const categories = categoriesProp ?? cms.categories;
  const visible = categories
    .filter((c) => !c.hidden)
    .sort((a, b) => a.order - b.order);

  const pillLabel = categorySection.pillLabel || "الفئات";
  const discoverText = categorySection.discoverText || "اكتشف";

  const desktopCols = Math.min(4, Math.max(1, categorySection.columns ?? 4));
  const mobileCols  = Math.min(2, Math.max(1, categorySection.mobileColumns ?? 1));

  const gridClass = [
    "grid gap-5 lg:gap-6",
    MOBILE_GRID[mobileCols] ?? "grid-cols-1",
    desktopCols <= 2 ? "" : "sm:grid-cols-2",
    DESKTOP_GRID[desktopCols] ?? "lg:grid-cols-4",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id="categories" data-section="categories" className="container-x pt-24 sm:pt-32">
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="pill mb-5">{pillLabel}</span>
        <h2
          className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.05] tracking-[-0.03em]"
          dir="auto"
        >
          {categorySection.title}
        </h2>
        <p className="mt-5 text-body text-base sm:text-lg leading-relaxed" dir="auto">
          {categorySection.intro}
        </p>
      </div>

      <div className={gridClass}>
        {visible.map((cat, i) => {
          const Icon = iconMap[cat.icon] ?? Home;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/categories/${cat.slug}`}
                className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white border border-line shadow-soft hover:shadow-lift transition-all duration-500 hover:-translate-y-1.5"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-bg">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/55" />
                  <div className="absolute top-4 left-4">
                    <span className="h-9 w-9 grid place-items-center rounded-full bg-white/90 backdrop-blur-md border border-white/40 text-ink shadow-sm">
                      <Icon className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3
                      className="font-sans font-extrabold text-3xl sm:text-[34px] text-white tracking-[-0.02em] leading-none"
                      dir="auto"
                    >
                      {cat.title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col flex-1 gap-5 p-5 sm:p-6">
                  <p className="text-sm sm:text-[15px] text-body leading-relaxed" dir="auto">
                    {cat.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-1">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink" dir="auto">
                      {discoverText}
                    </span>
                    <span className="h-9 w-9 grid place-items-center rounded-full bg-ink/5 text-ink transition-all duration-300 group-hover:bg-ink group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
