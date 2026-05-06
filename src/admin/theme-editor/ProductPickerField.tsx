import type { Product } from "../../cms/types";

export default function ProductPickerField({
  label,
  value,
  products,
  onChange,
}: {
  label: string;
  value: string[];
  products: Product[];
  onChange: (ids: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-black text-slate-700">{label}</div>
      {products.filter((product) => !product.hidden).slice(0, 12).map((product) => {
        const selected = value.includes(product.id);
        return (
          <button
            key={product.id}
            type="button"
            onClick={() => onChange(selected ? value.filter((id) => id !== product.id) : [...value, product.id])}
            className={`flex w-full items-center gap-3 rounded-2xl border p-2 text-right transition ${
              selected ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            <span className="h-10 w-10 overflow-hidden rounded-xl bg-slate-100">
              {product.images?.[0] && <img src={product.images[0]} alt="" className="h-full w-full object-cover" />}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-black">{product.title}</span>
          </button>
        );
      })}
    </div>
  );
}
