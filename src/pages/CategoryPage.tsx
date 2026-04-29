import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCms } from "../cms/store";
import ProductCard from "../components/ProductCard";

export default function CategoryPage() {
  const { slug } = useParams();
  const { categories, products } = useCms();
  const cat = categories.find((c) => c.slug === slug && !c.hidden);
  if (!cat) return <Navigate to="/products" replace />;

  const list = products
    .filter((p) => p.categoryId === cat.id && !p.hidden)
    .sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0">
          <img src={cat.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/40" />
        </div>
        <div className="container-x relative py-20 sm:py-28">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-ink mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            المنتجات كاملة
          </Link>
          <span className="pill mb-4">الفئة</span>
          <h1
            className="font-sans font-extrabold text-5xl sm:text-7xl text-ink leading-[1.05] tracking-[-0.03em]"
            dir="auto"
          >
            {cat.title}
          </h1>
          <p className="mt-5 text-body max-w-xl" dir="auto">
            {cat.description}
          </p>
        </div>
      </div>

      <div className="container-x py-16">
        {list.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-body" dir="auto">
            ما كاين تا منتج فهاد الفئة دابا.
          </div>
        )}
      </div>
    </div>
  );
}
