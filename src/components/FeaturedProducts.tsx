import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCms } from "../cms/store";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const { featuredSection, products } = useCms();
  const featured = products
    .filter((p) => p.featured && !p.hidden)
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);
  if (!featuredSection.enabled || featured.length === 0) return null;

  return (
    <section className="container-x pt-24 sm:pt-32">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10">
        <div className="max-w-2xl">
          <span className="pill mb-4">مختار</span>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {featured.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: i * 0.05 }}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link to="/products" className="btn-ghost">
          شوف المنتجات كاملة
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
