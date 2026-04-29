import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function RevolutBenefits() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Card 1: Light Mode (Smart Life) */}
          <div className="relative overflow-hidden rounded-[32px] bg-white border border-line shadow-sm min-h-[420px] md:min-h-[480px] p-8 md:p-12 group transition-all duration-300 hover:shadow-md">
            <div className="relative z-10 max-w-[280px]">
              <div className="mb-4 inline-flex items-center rounded-full bg-bg px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink border border-line">
                حياة ذكية
              </div>
              <h3 className="font-sans font-bold text-3xl md:text-4xl text-ink leading-tight mb-4" dir="rtl">
                تكنولوجيا كتسهل عليك يومك.
              </h3>
              <p className="text-body text-sm md:text-base leading-relaxed mb-8" dir="rtl">
                اختارنا ليك أفضل المنتجات اللي كتزيد من الراحة والتنظيم فدارك وفي حياتك اليومية بطريقة ذكية وعملية.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-red transition-colors"
                dir="rtl"
              >
                كتشف المزيد
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
            
            {/* Tilted Product Image */}
            <div className="absolute -bottom-8 -right-8 w-[280px] md:w-[340px] transition-transform duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2">
              <div className="rotate-12 translate-x-8 translate-y-8 rounded-2xl overflow-hidden shadow-2xl border border-line/50 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1584006682522-dc17d6c0d0cb?auto=format&fit=crop&w=800&q=80"
                  alt="Smart Life Product"
                  className="w-full h-auto object-cover aspect-square"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Dark Mode (Premium Quality) */}
          <div className="relative overflow-hidden rounded-[32px] bg-ink border border-ink shadow-sm min-h-[420px] md:min-h-[480px] p-8 md:p-12 group transition-all duration-300 hover:shadow-lift">
            {/* Subtle noise/texture for premium feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none noise"></div>
            
            <div className="relative z-10 max-w-[280px]">
              <div className="mb-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white border border-white/10 backdrop-blur-md">
                جودة ممتازة
              </div>
              <h3 className="font-sans font-bold text-3xl md:text-4xl text-white leading-tight mb-4" dir="rtl">
                منتجات مختارة بعناية.
              </h3>
              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8" dir="rtl">
                الجودة هي الأساس ديالنا. كل منتج داز من تجارب صارمة باش نضمنو ليك تجربة شراء راقية ومضمونة 100%.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-white/80 transition-colors"
                dir="rtl"
              >
                اطلب دابا
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
            
            {/* Tilted Product Image */}
            <div className="absolute -bottom-8 -right-8 w-[280px] md:w-[340px] transition-transform duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2">
              <div className="rotate-12 translate-x-8 translate-y-8 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-ink">
                <img
                  src="https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?auto=format&fit=crop&w=800&q=80"
                  alt="Premium Quality Product"
                  className="w-full h-auto object-cover aspect-square"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
