import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCms } from "../cms/store";
import type { FeaturedSectionContent, Product } from "../cms/types";
import ProductCard from "./ProductCard";

export default function FeaturedProducts({
  featuredSection: featuredSectionProp,
  products: productsProp,
}: {
  featuredSection?: FeaturedSectionContent;
  products?: Product[];
} = {}) {
  const cms = useCms();
  const featuredSection = featuredSectionProp ?? cms.featuredSection;
  const products = productsProp ?? cms.products;
  const configuredIds = featuredSection.productIds ?? [];
  const configured = configuredIds
    .map((id) => products.find((product) => product.id === id && !product.hidden))
    .filter(Boolean) as typeof products;
  const featured = (configured.length > 0 ? configured : products.filter((p) => p.featured && !p.hidden))
    .sort((a, b) => a.order - b.order)
    .slice(0, featuredSection.layout === "carousel" ? 8 : 4);
  if (!featuredSection.enabled || featured.length === 0) return null;

  return (
    <section className="container-x pt-24 sm:pt-32">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10">
        <div className="max-w-2xl">
          <span className="pill mb-4">{featuredSection.pillLabel || "مختار"}</span>
          <h2
            className="font-sans font-extrabold text-4xl sm:text-5xl text-ink leading-tight tracking-[-0.02em]"
            dir="auto"
          >
            {featuredSection.title}
          </h2>
        </div>
        <p className="text-body max-w-lg" dir="auto">
          {featuredSection.intro}
        </p>
      </div>

      <div
        className={
          featuredSection.layout === "carousel"
            ? "grid grid-flow-col auto-cols-[260px] gap-5 overflow-x-auto pb-3"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        }
      >
        {featured.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: i * 0.05 }}
          >
            <ProductCard
              product={p}
              showPrice={featuredSection.showPrice ?? true}
              showRating={featuredSection.showRating ?? true}
              showDiscountBadge={featuredSection.showDiscountBadge ?? true}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link to="/products" className="btn-ghost">
          {featuredSection.viewAllText || "شوف المنتجات كاملة"}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
