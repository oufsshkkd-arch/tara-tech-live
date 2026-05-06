import type { Product } from "../../cms/types";
import { useMemo, useState } from "react";

export default function ProductPickerField({
  label,
  value,
  products,
  max,
  onChange,
}: {
  label: string;
  value: string[];
  products: Product[];
  max?: number;
  onChange: (ids: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const selectedProducts = value
    .map((id) => products.find((product) => product.id === id && !product.hidden))
    .filter(Boolean) as Product[];
  const filteredProducts = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    return products
      .filter((product) => !product.hidden)
      .filter((product) => !cleanQuery || product.title.toLowerCase().includes(cleanQuery))
      .slice(0, 18);
  }, [products, query]);

  function toggleProduct(productId: string) {
    const selected = value.includes(productId);
    if (selected) {
      onChange(value.filter((id) => id !== productId));
      return;
    }
    const next = [...value, productId];
    onChange(typeof max === "number" ? next.slice(0, max) : next);
  }

  function moveProduct(productId: string, direction: -1 | 1) {
    const index = value.indexOf(productId);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= value.length) return;
    const next = [...value];
    const [item] = next.splice(index, 1);
    next.splice(targetIndex, 0, item);
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-xs font-black text-slate-700">{label}</div>
        {max && (
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
            value.length === max ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}
          >
            {value.length}/{max}
          </span>
        )}
      </div>

      {selectedProducts.length > 0 && (
        <div className="space-y-1 rounded-2xl border border-slate-200 bg-slate-50 p-2">
          {selectedProducts.map((product, index) => (
            <div key={product.id} className="flex items-center gap-2 rounded-xl bg-white p-2">
              <span className="text-[10px] font-black text-slate-400">{index + 1}</span>
              <span className="min-w-0 flex-1 truncate text-xs font-black text-slate-800">{product.title}</span>
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveProduct(product.id, -1)}
                className="rounded-lg px-2 py-1 text-[10px] font-black text-slate-500 hover:bg-slate-100 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={index === value.length - 1}
                onClick={() => moveProduct(product.id, 1)}
                className="rounded-lg px-2 py-1 text-[10px] font-black text-slate-500 hover:bg-slate-100 disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => toggleProduct(product.id)}
                className="rounded-lg px-2 py-1 text-[10px] font-black text-red-600 hover:bg-red-50"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="قلب على منتج..."
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      />

      {filteredProducts.map((product) => {
        const selected = value.includes(product.id);
        const disabled = !selected && typeof max === "number" && value.length >= max;
        return (
          <button
            key={product.id}
            type="button"
            disabled={disabled}
            onClick={() => toggleProduct(product.id)}
            className={`flex w-full items-center gap-3 rounded-2xl border p-2 text-right transition ${
              selected
                ? "border-slate-950 bg-slate-950 text-white"
                : disabled
                  ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            <span className="h-10 w-10 overflow-hidden rounded-xl bg-slate-100">
              {product.images?.[0] && <img src={product.images[0]} alt="" className="h-full w-full object-cover" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-black">{product.title}</span>
              <span className="block text-[11px] opacity-70">
                {product.price} درهم {product.compareAtPrice ? `• ${product.compareAtPrice} درهم` : ""}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
