import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "../cms/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-all duration-300 hover:shadow-lift hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-bg">
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-ink text-white text-[10px] uppercase tracking-wider px-2.5 py-1">
            {product.badge}
          </span>
        )}
        {product.stock === "low" && (
          <span className="absolute top-3 right-3 pill-red text-[10px]">
            كمية محدودة
          </span>
        )}
        <span className="absolute bottom-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-white text-ink opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-base font-medium text-ink leading-snug" dir="auto">
          {product.title}
        </h3>
        <p className="mt-1.5 text-sm text-body line-clamp-2" dir="auto">
          {product.shortDescription}
        </p>
        <div className="mt-4 flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-ink">
              {product.price} <span className="text-xs font-normal">درهم</span>
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-body line-through">
                {product.compareAtPrice} درهم
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
