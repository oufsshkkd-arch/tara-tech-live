import { useState, useMemo } from "react";
import { useCms } from "../cms/store";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
  const { products, categories } = useCms();
  const [active, setActive] = useState<string | "all">("all");
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc">("default");

  const visible = useMemo(() => {
    let list = products.filter((p) => !p.hidden);
    if (active !== "all") list = list.filter((p) => p.categoryId === active);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "default") list = [...list].sort((a, b) => a.order - b.order);
    return list;
  }, [products, active, sort]);

  return (
    <div className="container-x py-12 sm:py-20">
      <div className="max-w-3xl">
        <span className="pill mb-4">المتجر</span>
        <h1
          className="font-sans font-extrabold text-5xl sm:text-7xl text-ink leading-[1.05] tracking-[-0.03em]"
          dir="auto"
        >
          المنتجات كاملة
        </h1>
        <p className="mt-5 text-body max-w-xl" dir="auto">
          اختيار محرر ديال منتجات tech مفيدة، موثوقة ومختارة بذوق.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActive("all")}
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${
              active === "all"
                ? "bg-ink text-white border-ink"
                : "border-line bg-white text-ink hover:border-ink/30"
            }`}
          >
            الكل
          </button>
          {categories
            .filter((c) => !c.hidden)
            .map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  active === c.id
                    ? "bg-ink text-white border-ink"
                    : "border-line bg-white text-ink hover:border-ink/30"
                }`}
                dir="auto"
              >
                {c.title}
              </button>
            ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink"
        >
          <option value="default">ترتيب: عادي</option>
          <option value="price-asc">السعر: من القل</option>
          <option value="price-desc">السعر: من الكثر</option>
        </select>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {visible.length === 0 && (
        <div className="text-center py-20 text-body" dir="auto">
          ما كاين تا منتج فهاد الفئة.
        </div>
      )}
    </div>
  );
}
