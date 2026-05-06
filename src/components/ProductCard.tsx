import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import type { Product } from "../cms/types";
import { useCart } from "../store/cart";

export default function ProductCard({
  product,
  showPrice = true,
  showRating = true,
  showDiscountBadge = true,
}: {
  product: Product;
  showPrice?: boolean;
  showRating?: boolean;
  showDiscountBadge?: boolean;
}) {
  const { addItem } = useCart();

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.images[0],
    });
  }

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
        {showDiscountBadge && product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-ink text-white text-[10px] uppercase tracking-wider px-2.5 py-1">
            {product.badge}
          </span>
        )}
        {product.stock === "low" && (
          <span className="absolute top-3 right-3 pill-red text-[10px]">
            كمية محدودة
          </span>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-base font-medium text-ink leading-snug" dir="auto">
          {product.title}
        </h3>
        <p className="mt-1.5 text-sm text-body line-clamp-2" dir="auto">
          {product.shortDescription}
        </p>
        {showRating && (
          <div className="mt-3 flex items-center gap-1 text-amber-500" aria-label="5 star rating">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Star key={rating} className="h-3.5 w-3.5 fill-current" />
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between gap-2">
          {showPrice ? (
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
          ) : (
            <span className="text-xs font-medium text-body">السعر عند الطلب</span>
          )}
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 rounded-full bg-ink text-white text-xs font-semibold px-3 py-2 hover:bg-black/80 transition-colors shrink-0"
            dir="rtl"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            أضف للسلة
          </button>
        </div>
      </div>
    </Link>
  );
}
