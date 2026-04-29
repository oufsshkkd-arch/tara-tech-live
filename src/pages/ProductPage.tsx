import { useParams, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, ShieldCheck, Wallet, Truck, MessageCircle } from "lucide-react";
import { useCms } from "../cms/store";
import ProductCard from "../components/ProductCard";

export default function ProductPage() {
  const { slug } = useParams();
  const { products, categories, brand } = useCms();
  const product = products.find((p) => p.slug === slug && !p.hidden);
  const [active, setActive] = useState(0);
  if (!product) return <Navigate to="/products" replace />;
  const cat = categories.find((c) => c.id === product.categoryId);
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && !p.hidden)
    .slice(0, 4);

  const waLink = `https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `سلام Tara Tech، باغي نسوّل على: ${product.title}`
  )}`;

  return (
    <div className="pb-20">
      <div className="container-x pt-8 pb-4">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-ink">
          <ArrowLeft className="h-4 w-4" />
          رجوع
        </Link>
      </div>

      <div className="container-x grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div>
          <div className="aspect-square rounded-3xl overflow-hidden border border-line bg-white shadow-soft">
            <img src={product.images[active]} alt={product.title} className="h-full w-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`aspect-square rounded-xl overflow-hidden border transition-colors ${
                    active === i ? "border-ink" : "border-line hover:border-ink/30"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {cat && (
            <Link
              to={`/categories/${cat.slug}`}
              className="pill mb-4 inline-flex"
              dir="auto"
            >
              {cat.title}
            </Link>
          )}
          <h1
            className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.05] tracking-[-0.03em]"
            dir="auto"
          >
            {product.title}
          </h1>
          <p className="mt-4 text-body" dir="auto">{product.shortDescription}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-sans font-bold text-4xl text-ink">{product.price}</span>
            <span className="text-base text-body">درهم</span>
            {product.compareAtPrice && (
              <span className="text-sm text-body line-through">
                {product.compareAtPrice} درهم
              </span>
            )}
            {product.stock === "low" && (
              <span className="pill-red ml-2">كمية محدودة</span>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href={waLink} target="_blank" rel="noreferrer" className="btn-primary justify-center flex-1">
              <MessageCircle className="h-4 w-4" />
              اطلب على WhatsApp
            </a>
            <Link to="/contact" className="btn-ghost justify-center">
              تواصل معنا
            </Link>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
              <Wallet className="h-5 w-5 text-ink mt-0.5" />
              <div>
                <div className="text-sm font-medium text-ink">الدفع عند الاستلام</div>
                <div className="text-xs text-body" dir="auto">{product.codNote ?? "الدفع عند الاستلام متوفر."}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
              <ShieldCheck className="h-5 w-5 text-ink mt-0.5" />
              <div>
                <div className="text-sm font-medium text-ink" dir="auto">{product.guarantee ?? "متحقق قبل الإرسال"}</div>
                <div className="text-xs text-body" dir="auto">ثقة وجودة.</div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
              <Truck className="h-5 w-5 text-ink mt-0.5" />
              <div>
                <div className="text-sm font-medium text-ink">توصيل المغرب</div>
                <div className="text-xs text-body">جميع المدن.</div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
              <MessageCircle className="h-5 w-5 text-ink mt-0.5" />
              <div>
                <div className="text-sm font-medium text-ink">خدمة العملاء</div>
                <div className="text-xs text-body">أجوبة سريعة على WhatsApp.</div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-body mb-3">
              الوصف
            </h2>
            <p className="text-ink/80 leading-relaxed whitespace-pre-line" dir="auto">
              {product.longDescription}
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="container-x pt-24">
          <div className="flex items-end justify-between mb-8">
            <h2
              className="font-sans font-extrabold text-3xl sm:text-4xl text-ink tracking-[-0.02em]"
              dir="auto"
            >
              ممكن يعجبك حتى
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
